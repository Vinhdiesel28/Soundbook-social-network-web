package com.soundbook.controller;

import com.soundbook.dto.feed.FeedCommentResponse;
import com.soundbook.dto.socialcontent.PostCommentRequest;
import com.soundbook.dto.socialcontent.PostReactionRequest;
import com.soundbook.service.InteractionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<FeedCommentResponse> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody PostCommentRequest request,
            Authentication authentication)
    {
        FeedCommentResponse response = interactionService.addComment(authentication.getName(), postId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/posts/{postId}/reactions")
    public ResponseEntity<Void> reactToPost(
            @PathVariable Long postId,
            @Valid @RequestBody PostReactionRequest request,
           Authentication authentication)
    {
        interactionService.reactToPost(authentication.getName(), postId, request);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication)
    {
        interactionService.deleteComment(authentication.getName(),commentId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/comments/{commentId}/reactions")
    public ResponseEntity<Void> reactToComment(
            @PathVariable Long commentId,
            @Valid @RequestBody PostReactionRequest request,
            Authentication authentication)
    {
        interactionService.reactToComment(authentication.getName(),commentId, request);
        return ResponseEntity.ok().build();
    }
}