package com.soundbook.controller;

import com.soundbook.dto.admin.response.*;
import com.soundbook.dto.common.response.*;
import com.soundbook.service.admin.AdminRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {

    private final AdminRoomService adminRoomService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminRoomResponse>>> getAllRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminRoomResponse>>builder()
                .data(adminRoomService.getAllRooms(keyword, page, size)).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminRoomDetailResponse>> getRoomDetail(@PathVariable Long id)
    {
        return ResponseEntity.ok(ApiResponse.<AdminRoomDetailResponse>builder()
                .data(adminRoomService.getRoomDetail(id)).build());
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<ApiResponse<Void>> endRoom(@PathVariable Long id)
    {
        adminRoomService.endRoom(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().message("Đã đóng phòng").build());
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<PageResponse<AdminRoomMemberResponse>>> getRoomMembers(
            @PathVariable Long id, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size)
    {
        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminRoomMemberResponse>>builder()
                .data(adminRoomService.getRoomMembers(id, page, size)).build());
    }

    @DeleteMapping("/{roomId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> kickMember(@PathVariable Long roomId, @PathVariable Long userId)
    {
        adminRoomService.kickAndBanMember(roomId, userId);
        return ResponseEntity.ok(ApiResponse.<Void>builder().message("Đã kick và ban người dùng").build());
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<PageResponse<AdminRoomMessageResponse>>> getRoomMessages(
            @PathVariable Long id, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "30") int size)
    {
        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminRoomMessageResponse>>builder()
                .data(adminRoomService.getRoomMessages(id, page, size)).build());
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long messageId)
    {
        adminRoomService.deleteRoomMessage(messageId);
        return ResponseEntity.ok(ApiResponse.<Void>builder().message("Đã xóa tin nhắn").build());
    }

    @GetMapping("/{id}/queue")
    public ResponseEntity<ApiResponse<PageResponse<AdminRoomQueueResponse>>> getRoomQueue(
            @PathVariable Long id, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size)
    {
        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminRoomQueueResponse>>builder()
                .data(adminRoomService.getRoomQueue(id, page, size)).build());
    }

    @DeleteMapping("/queue/{queueId}")
    public ResponseEntity<ApiResponse<Void>> removeFromQueue(@PathVariable Long queueId)
    {
        adminRoomService.removeFromQueue(queueId);
        return ResponseEntity.ok(ApiResponse.<Void>builder().message("Đã xóa khỏi hàng đợi").build());
    }
}