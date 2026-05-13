package com.soundbook.service.admin.impl;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.admin.response.*;
import com.soundbook.dto.common.response.*;
import com.soundbook.entity.Room;
import com.soundbook.entity.RoomMember;
import com.soundbook.entity.RoomMemberId;
import com.soundbook.entity.RoomPlaybackState;
import com.soundbook.entity.enums.RoomStatus;
import com.soundbook.repository.*;
import com.soundbook.service.admin.AdminRoomService;
import com.soundbook.utils.PageMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminRoomServiceImpl implements AdminRoomService
{
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomMessageRepository roomMessageRepository;
    private final RoomQueueRepository roomQueueRepository;
    private final RoomPlaybackStateRepository roomPlaybackStateRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public PageResponse<AdminRoomResponse> getAllRooms(String keyword, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<Room> roomPage = roomRepository.searchRooms(keyword, pageable);

        return PageMapper.toPageResponse(roomPage.map(this::mapToAdminRoomResponse));
    }

    @Override
    public AdminRoomDetailResponse getRoomDetail(Long roomId)
    {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        RoomPlaybackState playback = roomPlaybackStateRepository.findById(roomId).orElse(null);

        return AdminRoomDetailResponse.builder()
                .info(mapToAdminRoomResponse(room))
                .currentTrackId(playback != null ? playback.getTrackId() : null)
                .isPlaying(playback != null && playback.getIsPlaying())
                .positionMs(playback != null ? playback.getPositionMs() : 0)
                .lastUpdatedBy(playback != null && playback.getUpdatedBy() != null
                        ? playback.getUpdatedBy().getDisplayName() : "Hệ thống")
                .build();
    }

    @Override
    @Transactional
    public void endRoom(Long id)
    {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_FOUND));

        room.setStatus(RoomStatus.ENDED);
        room.setEndedAt(LocalDateTime.now());
        room.setIsClosedByAdmin(true);
        roomRepository.save(room);

        roomMemberRepository.updateLeaveTimeForAllMembers(id, LocalDateTime.now());

        messagingTemplate.convertAndSend(
                "/topic/rooms/" + id + "/status",
                java.util.Map.of("status", "ENDED", "roomId", id)
        );
    }

    @Override
    public PageResponse<AdminRoomMemberResponse> getRoomMembers(Long roomId, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("joinedAt").descending());
        return PageMapper.toPageResponse(roomMemberRepository.findByRoomId(roomId, pageable).map(m ->
                AdminRoomMemberResponse.builder()
                        .userId(m.getUser().getId())
                        .displayName(m.getUser().getDisplayName())
                        .role(m.getRole().toString())
                        .isBanned(m.isBanned())
                        .joinedAt(m.getJoinedAt())
                        .leftAt(m.getLeftAt())
                        .build()
        ));
    }

    @Override
    @Transactional
    public void kickAndBanMember(Long roomId, Long userId)
    {
        RoomMember member = roomMemberRepository.findById(new RoomMemberId(roomId, userId))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        member.setBanned(true);
        member.setLeftAt(LocalDateTime.now());
        roomMemberRepository.save(member);
    }

    @Override
    public PageResponse<AdminRoomMessageResponse> getRoomMessages(Long roomId, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        return PageMapper.toPageResponse(roomMessageRepository.findByRoomId(roomId, pageable).map(msg ->
                AdminRoomMessageResponse.builder()
                        .id(msg.getId())
                        .senderId(msg.getSender().getId())
                        .senderName(msg.getSender().getDisplayName())
                        .senderAvatar(msg.getSender().getProfile() != null ? msg.getSender().getProfile().getAvatarUrl() : null)
                        .contentType(msg.getContentType().toString())
                        .contentText(msg.getContentText())
                        .createdAt(msg.getCreatedAt())
                        .build()
        ));
    }

    @Override
    @Transactional
    public void deleteRoomMessage(Long messageId)
    {
        roomMessageRepository.deleteById(messageId);
    }

    @Override
    public PageResponse<AdminRoomQueueResponse> getRoomQueue(Long roomId, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("positionOrder").ascending());
        return PageMapper.toPageResponse(roomQueueRepository.findByRoomIdAndPlayedAtIsNull(roomId, pageable).map(q ->
                AdminRoomQueueResponse.builder()
                        .id(q.getId())
                        .trackId(q.getTrackId())
                        .trackPayloadJson(q.getTrackPayloadJson())
                        .addedByName(q.getAddedBy().getDisplayName())
                        .voteCount(q.getVoteCount())
                        .positionOrder(q.getPositionOrder())
                        .createdAt(q.getCreatedAt())
                        .build()
        ));
    }

    @Override
    @Transactional
    public void removeFromQueue(Long queueId)
    {
        roomQueueRepository.deleteById(queueId);
    }

    private AdminRoomResponse mapToAdminRoomResponse(Room room)
    {
        long memberCount = roomMemberRepository.countByRoom_Id(room.getId());
        return AdminRoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .topic(room.getTopic() != null ? room.getTopic() : room.getName())
                .hostName(room.getHost().getDisplayName())
                .isPublic(room.getIsPublic())
                .status(room.getStatus().toString())
                .memberCount((int) memberCount)
                .createdAt(room.getCreatedAt())
                .endedAt(room.getEndedAt())
                .build();
    }
}