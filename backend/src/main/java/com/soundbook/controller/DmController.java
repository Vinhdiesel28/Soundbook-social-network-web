package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.dm.*;
import com.soundbook.service.DmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dm")
@RequiredArgsConstructor
public class DmController {

    private final DmService dmService;

    @PostMapping("/threads")
    public ApiResponse<DmThreadResponse> upsertThread(@Valid @RequestBody DmThreadUpsertRequest request) {
        return ApiResponse.success(dmService.upsertThread(request));
    }

    @GetMapping("/threads")
    public ApiResponse<DmCursorPageResponse<DmThreadResponse>> getThreads(
            @RequestParam Long userId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.success(dmService.getThreads(userId, cursor, limit));
    }

    @GetMapping("/threads/{threadId}/messages")
    public ApiResponse<DmCursorPageResponse<DmMessageResponse>> getMessages(
            @PathVariable Long threadId,
            @RequestParam Long userId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "30") int limit) {
        return ApiResponse.success(dmService.getThreadMessages(threadId, userId, cursor, limit));
    }

    @PostMapping("/threads/{threadId}/messages")
    public ApiResponse<DmMessageResponse> sendMessage(
            @PathVariable Long threadId,
            @Valid @RequestBody DmMessageSendRequest request) {
        return ApiResponse.success(dmService.sendMessage(threadId, request));
    }

    @PostMapping("/messages/{messageId}/reaction")
    public ApiResponse<DmMessageResponse> reactMessage(
            @PathVariable Long messageId,
            @Valid @RequestBody DmReactionRequest request) {
        return ApiResponse.success(dmService.reactMessage(messageId, request));
    }

    @PostMapping("/messages/{messageId}/reply")
    public ApiResponse<DmMessageResponse> replyMessage(
            @PathVariable Long messageId,
            @Valid @RequestBody DmReplyRequest request) {
        return ApiResponse.success(dmService.replyMessage(messageId, request));
    }

    @DeleteMapping("/messages/{messageId}")
    public ApiResponse<Void> deleteMessage(
            @PathVariable Long messageId,
            @RequestParam String mode,
            @RequestParam Long userId) {
        dmService.deleteMessage(messageId, userId, mode);
        return ApiResponse.success();
    }

    @PostMapping("/threads/{threadId}/share")
    public ApiResponse<DmMessageResponse> shareToThread(
            @PathVariable Long threadId,
            @Valid @RequestBody DmShareRequest request) {
        return ApiResponse.success(dmService.shareToThread(threadId, request));
    }
}
