package com.soundbook.service.admin.impl;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.response.AdminCommentResponse;
import com.soundbook.dto.response.AdminPostResponse;
import com.soundbook.dto.response.PageResponse;
import com.soundbook.dto.response.ReactionResponse;
import com.soundbook.entity.Comment;
import com.soundbook.entity.Post;
import com.soundbook.entity.Reaction;
import com.soundbook.entity.enums.PostStatus;
import com.soundbook.entity.enums.ReactionType;
import com.soundbook.entity.enums.TargetType;
import com.soundbook.repository.CommentRepository;
import com.soundbook.repository.PostRepository;
import com.soundbook.repository.ReactionRepository;
import com.soundbook.service.admin.AdminPostService;
import com.soundbook.utils.PageMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminPostServiceImpl implements AdminPostService
{
    private final PostRepository postRepository;
    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;

    @Override
    public PageResponse<AdminPostResponse> getAllPosts(String keyword, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Post> postPage = postRepository.searchAllWithAuthor(keyword, pageable);
        Page<AdminPostResponse> responsePage = postPage.map(this::mapToAdminPostResponse);

        return PageMapper.toPageResponse(responsePage);
    }

    @Override
    public PageResponse<ReactionResponse> getPostReactions(Long postId, ReactionType type, int page, int size)
    {
        postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Reaction> reactionPage = reactionRepository.findByTarget(postId, TargetType.POST, type, pageable);

        Page<ReactionResponse> responsePage = reactionPage.map(reaction -> ReactionResponse.builder()
                .id(reaction.getId())
                .userId(reaction.getUser().getId())
                .userName(reaction.getUser().getDisplayName())
                .avatarUrl(reaction.getUser().getProfile() != null
                        ? reaction.getUser().getProfile().getAvatarUrl() : null)
                .type(reaction.getReactionType())
                .createdAt(reaction.getCreatedAt())
                .build());

        return PageMapper.toPageResponse(responsePage);
    }

    @Override
    public PageResponse<ReactionResponse> getCommentReactions(Long commentId, ReactionType type, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Reaction> reactionPage = reactionRepository.findByTarget(commentId, TargetType.COMMENT, type, pageable);

        Page<ReactionResponse> responsePage = reactionPage.map(reaction -> ReactionResponse.builder()
                .id(reaction.getId())
                .userId(reaction.getUser().getId())
                .userName(reaction.getUser().getDisplayName())
                .avatarUrl(reaction.getUser().getProfile() != null
                        ? reaction.getUser().getProfile().getAvatarUrl() : null)
                .type(reaction.getReactionType())
                .createdAt(reaction.getCreatedAt())
                .build());

        return PageMapper.toPageResponse(responsePage);
    }

    @Override
    public AdminPostResponse getPostById(Long id)
    {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        return mapToAdminPostResponse(post);
    }

    @Override
    @Transactional
    public void deletePost(Long id)
    {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        post.setStatus(PostStatus.DELETED);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public void hidePost(Long id)
    {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        post.setStatus(PostStatus.HIDDEN);
        postRepository.save(post);
    }

    @Override
    @Transactional
    public void unhidePost(Long id)
    {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        post.setStatus(PostStatus.ACTIVE);

        postRepository.save(post);
    }

    @Override
    public PageResponse<AdminCommentResponse> getPostComments(Long postId, int page, int size)
    {
        if (!postRepository.existsById(postId))
        {
            throw new AppException(ErrorCode.POST_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Comment> commentPage = commentRepository.findByPostId(postId, pageable);

        Page<AdminCommentResponse> responsePage = commentPage.map(comment -> AdminCommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .authorId(comment.getUser().getId())
                .authorName(comment.getUser().getDisplayName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build());

        return PageMapper.toPageResponse(responsePage);
    }

    private AdminPostResponse mapToAdminPostResponse(Post post)
    {
        return AdminPostResponse.builder()
                .id(post.getId())
                .authorId(post.getUser().getId())
                .authorName(post.getUser().getDisplayName())
                .authorEmail(post.getUser().getEmail())
                .type(post.getType())
                .visibility(post.getVisibility())
                .status(post.getStatus())
                .caption(post.getCaption())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
