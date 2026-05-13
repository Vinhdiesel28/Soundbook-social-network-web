package com.soundbook.service;

import com.soundbook.dto.feed.FeedCommentResponse;
import com.soundbook.dto.socialcontent.PostCommentRequest;
import com.soundbook.dto.socialcontent.PostReactionRequest;

public interface InteractionService
{
    FeedCommentResponse addComment(String email, Long postId, PostCommentRequest request);

    void deleteComment(String email, Long commentId);

    void reactToPost(String email, Long postId, PostReactionRequest request);

    void reactToComment(String email, Long commentId, PostReactionRequest request);
}
