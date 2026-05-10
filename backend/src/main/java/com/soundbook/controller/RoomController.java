package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.room.*;
import com.soundbook.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ApiResponse<RoomDetailResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        return ApiResponse.success(roomService.createRoom(request));
    }

    @GetMapping("/active")
    public ApiResponse<List<ActiveRoomResponse>> getActiveRooms(
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.success(roomService.getActiveRooms(limit));
    }

    @PostMapping("/{roomId}/join")
    public ApiResponse<RoomDetailResponse> joinRoom(
            @PathVariable Long roomId,
            @Valid @RequestBody RoomActionRequest request) {
        return ApiResponse.success(roomService.joinRoom(roomId, request.getUserId()));
    }

    @PostMapping("/{roomId}/leave")
    public ApiResponse<RoomDetailResponse> leaveRoom(
            @PathVariable Long roomId,
            @Valid @RequestBody RoomActionRequest request) {
        return ApiResponse.success(roomService.leaveRoom(roomId, request.getUserId()));
    }

    @GetMapping("/{roomId}")
    public ApiResponse<RoomDetailResponse> getRoomDetail(@PathVariable Long roomId) {
        return ApiResponse.success(roomService.getRoomDetail(roomId));
    }

    @GetMapping("/{roomId}/state")
    public ApiResponse<RoomPlaybackStateResponse> getRoomState(@PathVariable Long roomId) {
        return ApiResponse.success(roomService.getRoomState(roomId));
    }

    @GetMapping("/{roomId}/queue")
    public ApiResponse<List<RoomQueueItemResponse>> getRoomQueue(@PathVariable Long roomId) {
        return ApiResponse.success(roomService.getRoomQueue(roomId));
    }

    @PostMapping("/{roomId}/queue")
    public ApiResponse<RoomQueueItemResponse> addToQueue(
            @PathVariable Long roomId,
            @Valid @RequestBody RoomQueueAddRequest request) {
        return ApiResponse.success(roomService.addToQueue(roomId, request));
    }

    @PostMapping("/{roomId}/queue/{queueItemId}/vote")
    public ApiResponse<RoomQueueItemResponse> voteQueueItem(@PathVariable Long queueItemId) {
        return ApiResponse.success(roomService.voteQueueItem(queueItemId));
    }
}
