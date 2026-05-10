package com.soundbook.controller;

import com.soundbook.dto.common.response.ApiResponse;
import com.soundbook.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController
{
    private final AiService aiService;

    @GetMapping("/posts/{postId}/insight")
    public ResponseEntity<ApiResponse<String>> getPostInsight(@PathVariable Long postId)
    {
        String insight = aiService.getPostInsight(postId);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("SoundbookAI đã phân tích bài viết xong")
                .data(insight)
                .build());
    }

    @PostMapping("/posts/{postId}/chat")
    public ResponseEntity<ApiResponse<String>> chatAboutPost(
            @PathVariable Long postId,
            @RequestBody Map<String, String> payload)
    {
        String userMessage = payload.get("message");
        if (userMessage == null || userMessage.isBlank())
        {
            throw new IllegalArgumentException("Nội dung tin nhắn không được để trống");
        }

        String aiResponse = aiService.chatWithPost(postId, userMessage);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("Phản hồi từ Soundbook AI")
                .data(aiResponse)
                .build());
    }
}