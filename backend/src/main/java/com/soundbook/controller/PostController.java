package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.dto.feed.FeedCommentResponse;
import com.soundbook.dto.feed.FeedPostResponse;
import com.soundbook.dto.socialcontent.*;
import com.soundbook.service.PostService;
import com.soundbook.service.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final ReactionService reactionService;
    private final com.soundbook.service.admin.FileUploadService fileUploadService;

    @PostMapping(value = "/media", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> uploadMedia(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        String url = fileUploadService.uploadFile(file, "posts");
        return ResponseEntity.ok(ApiResponse.success(url));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedPostResponse>> createPost(Authentication authentication, @RequestBody PostMutationRequest request) {
        return ResponseEntity.ok(ApiResponse.success(postService.createPost(authentication.getName(), request)));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<ApiResponse<FeedPostResponse>> updatePost(Authentication authentication, @PathVariable Long postId, @RequestBody PostMutationRequest request) {
        return ResponseEntity.ok(ApiResponse.success(postService.updatePost(authentication.getName(), postId, request)));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> deletePost(Authentication authentication, @PathVariable Long postId) {
        postService.deletePost(authentication.getName(), postId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PatchMapping("/{postId}/comments-enabled")
    public ResponseEntity<ApiResponse<FeedPostResponse>> toggleComments(Authentication authentication, @PathVariable Long postId, @RequestParam boolean enabled) {
        return ResponseEntity.ok(ApiResponse.success(postService.toggleComments(authentication.getName(), postId, enabled)));
    }

    @PostMapping("/{postId}/reaction")
    public ResponseEntity<ApiResponse<FeedPostResponse>> react(Authentication authentication, @PathVariable Long postId, @RequestBody PostReactionRequest request) {
        return ResponseEntity.ok(ApiResponse.success(postService.react(authentication.getName(), postId, request)));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<FeedCommentResponse>> comment(Authentication authentication, @PathVariable Long postId, @RequestBody PostCommentRequest request) {
        return ResponseEntity.ok(ApiResponse.success(postService.comment(authentication.getName(), postId, request)));
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<ApiResponse<com.soundbook.dto.common.response.PageResponse<FeedCommentResponse>>> getPostComments(
            Authentication authentication,
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(ApiResponse.success(postService.getPostComments(authentication.getName(), postId, page, size)));
    }

    @GetMapping("/{postId}/comments/{commentId}/replies")
    public ResponseEntity<ApiResponse<java.util.List<FeedCommentResponse>>> getCommentReplies(
            Authentication authentication,
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        return ResponseEntity.ok(ApiResponse.success(postService.getCommentReplies(authentication.getName(), commentId)));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(Authentication authentication, @PathVariable Long commentId) {
        postService.deleteComment(authentication.getName(), commentId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PostMapping("/comments/{commentId}/reaction")
    public ResponseEntity<ApiResponse<Void>> reactComment(Authentication authentication, @PathVariable Long commentId, @RequestBody PostReactionRequest request) {
        postService.reactComment(authentication.getName(), commentId, request);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PostMapping("/{postId}/share")
    public ResponseEntity<ApiResponse<FeedPostResponse>> share(Authentication authentication, @PathVariable Long postId, @RequestBody(required = false) PostShareRequest request) {
        return ResponseEntity.ok(ApiResponse.success(postService.share(authentication.getName(), postId, request)));
    }

    @GetMapping("/{targetId}/reactions")
    public ResponseEntity<ApiResponse<PageResponse<ReactionResponse>>> getTargetReactions(
            @PathVariable Long targetId,
            @RequestParam(name = "targetType", defaultValue = "POST") com.soundbook.entity.enums.TargetType targetType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size)
    {
        PageResponse<ReactionResponse> reactions = reactionService.getReactionsByTargetId(targetId, targetType, page, size);

        return ResponseEntity.ok(ApiResponse.<PageResponse<ReactionResponse>>builder()
                .message("Lấy danh sách reaction thành công")
                .data(reactions)
                .build());
    }
}
