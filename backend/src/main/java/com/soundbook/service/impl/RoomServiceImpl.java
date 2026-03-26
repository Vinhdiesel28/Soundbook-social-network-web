package com.soundbook.service.impl;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.room.ActiveRoomResponse;
import com.soundbook.dto.room.CreateRoomRequest;
import com.soundbook.dto.room.RoomDetailResponse;
import com.soundbook.dto.room.RoomMemberResponse;
import com.soundbook.dto.room.RoomPlaybackStateResponse;
import com.soundbook.entity.*;
import com.soundbook.entity.enums.RoomRole;
import com.soundbook.entity.enums.RoomStatus;
import com.soundbook.repository.*;
import com.soundbook.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomPlaybackStateRepository roomPlaybackStateRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Override
    public RoomDetailResponse createRoom(CreateRoomRequest request) {
        User host = userRepository.findById(request.getHostUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Room room = Room.builder()
                .host(host)
                .name(request.getName())
                .topic(request.getTopic())
                .isPublic(request.getIsPublic() == null ? Boolean.TRUE : request.getIsPublic())
                .status(RoomStatus.LIVE)
                .build();
        Room savedRoom = roomRepository.save(room);

        RoomMember hostMember = RoomMember.builder()
                .id(new RoomMemberId(savedRoom.getId(), host.getId()))
                .room(savedRoom)
                .user(host)
                .role(RoomRole.HOST)
                .leftAt(null)
                .build();
        roomMemberRepository.save(hostMember);

        RoomPlaybackState playbackState = RoomPlaybackState.builder()
                .room(savedRoom)
                .trackId(null)
                .trackPayloadJson(null)
                .positionMs(0)
                .isPlaying(false)
                .updatedBy(host)
                .build();
        roomPlaybackStateRepository.save(playbackState);

        return buildRoomDetail(savedRoom);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActiveRoomResponse> getActiveRooms(int limit) {
        int sanitizedLimit = Math.max(1, Math.min(limit, 100));
        List<Room> rooms = roomRepository.findByStatusOrderByCreatedAtDesc(RoomStatus.LIVE, PageRequest.of(0, sanitizedLimit));

        List<Long> hostIds = rooms.stream().map(room -> room.getHost().getId()).toList();
        Map<Long, UserProfile> profileByUserId = userProfileRepository.findAllById(hostIds)
                .stream()
                .collect(Collectors.toMap(UserProfile::getUserId, Function.identity()));

        return rooms.stream().map(room -> {
            long listeners = roomMemberRepository.countByRoom_IdAndLeftAtIsNull(room.getId());
            UserProfile hostProfile = profileByUserId.get(room.getHost().getId());
            RoomPlaybackState state = roomPlaybackStateRepository.findById(room.getId()).orElse(null);
            return ActiveRoomResponse.builder()
                    .roomId(room.getId())
                    .name(room.getName())
                    .topic(room.getTopic())
                    .hostUserId(room.getHost().getId())
                    .hostDisplayName(room.getHost().getDisplayName())
                    .hostAvatarUrl(hostProfile != null ? hostProfile.getAvatarUrl() : null)
                    .listenersCount(listeners)
                    .createdAt(room.getCreatedAt())
                    .state(toStateResponse(state))
                    .build();
        }).toList();
    }

    @Override
    public RoomDetailResponse joinRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        if (room.getStatus() == RoomStatus.ENDED) {
            throw new AppException(ErrorCode.ROOM_ALREADY_ENDED);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        RoomMemberId memberId = new RoomMemberId(roomId, userId);
        RoomMember roomMember = roomMemberRepository.findById(memberId).orElse(null);

        if (roomMember != null && roomMember.getLeftAt() == null) {
            throw new AppException(ErrorCode.ROOM_ALREADY_JOINED);
        }

        if (roomMember == null) {
            roomMember = RoomMember.builder()
                    .id(memberId)
                    .room(room)
                    .user(user)
                    .role(RoomRole.MEMBER)
                    .leftAt(null)
                    .build();
        } else {
            roomMember.setLeftAt(null);
        }

        roomMemberRepository.save(roomMember);
        return buildRoomDetail(room);
    }

    @Override
    public RoomDetailResponse leaveRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        RoomMember roomMember = roomMemberRepository.findById(new RoomMemberId(roomId, userId))
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_MEMBER_NOT_FOUND));

        if (roomMember.getLeftAt() != null) {
            throw new AppException(ErrorCode.ROOM_MEMBER_NOT_FOUND);
        }

        LocalDateTime now = LocalDateTime.now();
        roomMember.setLeftAt(now);
        roomMemberRepository.save(roomMember);

        if (roomMember.getRole() == RoomRole.HOST && room.getStatus() == RoomStatus.LIVE) {
            room.setStatus(RoomStatus.ENDED);
            room.setEndedAt(now);
            roomRepository.save(room);

            List<RoomMember> activeMembers = roomMemberRepository.findByRoom_IdAndLeftAtIsNull(roomId);
            for (RoomMember member : activeMembers) {
                member.setLeftAt(now);
            }
            roomMemberRepository.saveAll(activeMembers);
        }

        return buildRoomDetail(room);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomDetailResponse getRoomDetail(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        return buildRoomDetail(room);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomPlaybackStateResponse getRoomState(Long roomId) {
        RoomPlaybackState state = roomPlaybackStateRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));
        return toStateResponse(state);
    }

    private RoomDetailResponse buildRoomDetail(Room room) {
        List<RoomMember> activeMembers = roomMemberRepository.findByRoom_IdAndLeftAtIsNull(room.getId());
        List<Long> userIds = activeMembers.stream().map(member -> member.getUser().getId()).toList();
        Map<Long, UserProfile> profileByUserId = userProfileRepository.findAllById(userIds)
                .stream()
                .collect(Collectors.toMap(UserProfile::getUserId, Function.identity()));

        List<RoomMemberResponse> members = activeMembers.stream()
                .map(member -> {
                    UserProfile profile = profileByUserId.get(member.getUser().getId());
                    return RoomMemberResponse.builder()
                            .userId(member.getUser().getId())
                            .displayName(member.getUser().getDisplayName())
                            .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                            .role(member.getRole().name())
                            .build();
                })
                .toList();

        RoomPlaybackState state = roomPlaybackStateRepository.findById(room.getId()).orElse(null);

        return RoomDetailResponse.builder()
                .roomId(room.getId())
                .name(room.getName())
                .topic(room.getTopic())
                .isPublic(room.getIsPublic())
                .status(room.getStatus().name())
                .hostUserId(room.getHost().getId())
                .hostDisplayName(room.getHost().getDisplayName())
                .createdAt(room.getCreatedAt())
                .endedAt(room.getEndedAt())
                .listenersCount((long) members.size())
                .state(toStateResponse(state))
                .members(members)
                .build();
    }

    private RoomPlaybackStateResponse toStateResponse(RoomPlaybackState state) {
        if (state == null) {
            return null;
        }
        return RoomPlaybackStateResponse.builder()
                .trackId(state.getTrackId())
                .trackPayloadJson(state.getTrackPayloadJson())
                .positionMs(state.getPositionMs())
                .isPlaying(state.getIsPlaying())
                .updatedAt(state.getUpdatedAt())
                .updatedByUserId(state.getUpdatedBy() != null ? state.getUpdatedBy().getId() : null)
                .build();
    }
}
