package com.soundbook.controller;

import com.soundbook.dto.admin.response.AdminDmMessageResponse;
import com.soundbook.dto.admin.response.AdminDmThreadResponse;
import com.soundbook.dto.common.response.ApiResponse;
import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.service.admin.AdminDmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/dm")
@RequiredArgsConstructor
public class AdminDmController
{
    private final AdminDmService adminDmService;

    @GetMapping("/threads")
    public ResponseEntity<ApiResponse<PageResponse<AdminDmThreadResponse>>> getAllThreads(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        String searchKeyword = (keyword != null) ? keyword.trim() : null;

        PageResponse<AdminDmThreadResponse> data = adminDmService.getAllThreads(searchKeyword, page, size);

        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminDmThreadResponse>>builder()
                .message("Lấy danh sách hội thoại thành công")
                .data(data)
                .build());
    }

    @GetMapping("/threads/{id}/messages")
    public ResponseEntity<ApiResponse<PageResponse<AdminDmMessageResponse>>> getThreadMessages(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size)
    {
        PageResponse<AdminDmMessageResponse> data = adminDmService.getThreadMessages(id, page, size);
        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminDmMessageResponse>>builder()
                .message("Lấy danh sách tin nhắn thành công")
                .data(data)
                .build());
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id)
    {
        adminDmService.deleteMessageHard(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Xóa vĩnh viễn tin nhắn thành công")
                .build());
    }

    @PutMapping("/messages/{id}/delete-for-everyone")
    public ResponseEntity<ApiResponse<Void>> deleteMessageForEveryone(@PathVariable Long id) {
        adminDmService.deleteMessageForEveryone(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Thu hồi tin nhắn với tất cả mọi người thành công")
                .build());
    }
}
