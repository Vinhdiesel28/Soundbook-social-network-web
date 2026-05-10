package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.feed.FeedCommentResponse;
import com.soundbook.dto.feed.FeedPostResponse;
import com.soundbook.dto.socialcontent.PostCommentRequest;
import com.soundbook.dto.socialcontent.PostMutationRequest;
import com.soundbook.dto.socialcontent.PostReactionRequest;
import com.soundbook.dto.socialcontent.PostShareRequest;
import com.soundbook.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

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

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(Authentication authentication, @PathVariable Long commentId) {
        postService.deleteComment(authentication.getName(), commentId);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PostMapping("/{postId}/share")
    public ResponseEntity<ApiResponse<FeedPostResponse>> share(Authentication authentication, @PathVariable Long postId, @RequestBody(required = false) PostShareRequest request) {
        return ResponseEntity.ok(ApiResponse.success(postService.share(authentication.getName(), postId, request)));
    }
}
