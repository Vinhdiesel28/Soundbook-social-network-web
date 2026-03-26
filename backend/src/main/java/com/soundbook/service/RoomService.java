package com.soundbook.service;

import com.soundbook.dto.room.ActiveRoomResponse;
import com.soundbook.dto.room.CreateRoomRequest;
import com.soundbook.dto.room.RoomDetailResponse;
import com.soundbook.dto.room.RoomPlaybackStateResponse;

import java.util.List;

public interface RoomService {
    RoomDetailResponse createRoom(CreateRoomRequest request);

    List<ActiveRoomResponse> getActiveRooms(int limit);

    RoomDetailResponse joinRoom(Long roomId, Long userId);

    RoomDetailResponse leaveRoom(Long roomId, Long userId);

    RoomDetailResponse getRoomDetail(Long roomId);

    RoomPlaybackStateResponse getRoomState(Long roomId);
}
