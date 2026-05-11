package com.soundbook.service.admin;

import com.soundbook.dto.admin.response.AdminCommentResponse;
import com.soundbook.dto.admin.response.AdminPostResponse;
import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.dto.admin.response.ReactionResponse;
import com.soundbook.entity.enums.ReactionType;

public interface AdminPostService
{
    PageResponse<AdminPostResponse> getAllPosts(String keyword, int page, int size);

    PageResponse<ReactionResponse> getPostReactions(Long postId, ReactionType type, int page, int size);

    PageResponse<ReactionResponse> getCommentReactions(Long commentId, ReactionType type, int page, int size);

    AdminPostResponse getPostById(Long id);

    void deletePost(Long id);

    void hidePost(Long id);

    void unhidePost(Long id);

    PageResponse<AdminCommentResponse> getPostComments(Long postId, int page, int size);
}
