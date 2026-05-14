package com.soundbook.controller;

import com.soundbook.dto.admin.response.AdminCommentResponse;
import com.soundbook.dto.admin.response.AdminPostResponse;
import com.soundbook.dto.admin.response.ReactionResponse;
import com.soundbook.dto.common.response.*;
import com.soundbook.entity.enums.ReactionType;
import com.soundbook.service.admin.AdminPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/posts")
@RequiredArgsConstructor
public class AdminPostController
{
    private final AdminPostService adminPostService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminPostResponse>>> getAllPosts(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        String searchKeyword = (keyword != null) ? keyword.trim() : null;
        PageResponse<AdminPostResponse> data = adminPostService.getAllPosts(searchKeyword, page, size);

        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminPostResponse>>builder()
                .message("Lấy danh sách bài viết thành công")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminPostResponse>> getPostById(@PathVariable Long id)
    {
        AdminPostResponse data = adminPostService.getPostById(id);

        return ResponseEntity.ok(ApiResponse.<AdminPostResponse>builder()
                .message("Lấy chi tiết bài viết thành công")
                .data(data)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id)
    {
        adminPostService.deletePost(id);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đã xóa bài viết thành công")
                .build());
    }

    @PutMapping("/{id}/hide")
    public ResponseEntity<ApiResponse<Void>> hidePost(@PathVariable Long id)
    {
        adminPostService.hidePost(id);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đã ẩn bài viết thành công")
                .build());
    }

    @PutMapping("/{id}/unhide")
    public ResponseEntity<ApiResponse<Void>> unhidePost(@PathVariable Long id)
    {
        adminPostService.unhidePost(id);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đã hiển thị lại bài viết thành công")
                .build());
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<PageResponse<AdminCommentResponse>>> getPostComments(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        PageResponse<AdminCommentResponse> data = adminPostService.getPostComments(id, page, size);

        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminCommentResponse>>builder()
                .message("Lấy danh sách bình luận thành công")
                .data(data)
                .build());
    }

    @DeleteMapping("{postId}/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId)
    {
        adminPostService.deleteComment(commentId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đã xóa bình luận thành công")
                .build());
    }

    @GetMapping("/{id}/reactions")
    public ResponseEntity<ApiResponse<PageResponse<ReactionResponse>>> getPostReactions(
            @PathVariable Long id,
            @RequestParam(required = false) ReactionType type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        PageResponse<ReactionResponse> data = adminPostService.getPostReactions(id, type, page, size);

        return ResponseEntity.ok(ApiResponse.<PageResponse<ReactionResponse>>builder()
                .message("Lấy danh sách tương tác thành công")
                .data(data)
                .build());
    }

    @GetMapping("/{postId}/comments/{commentId}/reactions")
    public ResponseEntity<ApiResponse<PageResponse<ReactionResponse>>> getCommentReactions(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestParam(required = false) ReactionType type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        PageResponse<ReactionResponse> data = adminPostService.getCommentReactions(commentId, type, page, size);

        return ResponseEntity.ok(ApiResponse.<PageResponse<ReactionResponse>>builder()
                .message("Lấy danh sách tương tác thành công")
                .data(data)
                .build());
    }

    @GetMapping("/{postId}/comments/{commentId}/replies")
    public ResponseEntity<ApiResponse<java.util.List<AdminCommentResponse>>> getCommentReplies(
            @PathVariable Long postId,
            @PathVariable Long commentId)
    {
        java.util.List<AdminCommentResponse> data = adminPostService.getCommentReplies(commentId);
        return ResponseEntity.ok(ApiResponse.<java.util.List<AdminCommentResponse>>builder()
                .message("Lấy danh sách phản hồi thành công")
                .data(data)
                .build());
    }
}
