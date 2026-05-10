package com.soundbook.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.feed.FeedCommentResponse;
import com.soundbook.dto.feed.FeedPostResponse;
import com.soundbook.dto.socialcontent.PostCommentRequest;
import com.soundbook.dto.socialcontent.PostMutationRequest;
import com.soundbook.dto.socialcontent.PostReactionRequest;
import com.soundbook.dto.socialcontent.PostShareRequest;
import com.soundbook.entity.*;
import com.soundbook.entity.enums.*;
import com.soundbook.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostMediaRepository postMediaRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final FeedService feedService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public FeedPostResponse createPost(String email, PostMutationRequest request) {
        User user = currentUser(email);
        Post post = Post.builder()
                .user(user)
                .type(request.getType() == null ? PostType.BLOG : request.getType())
                .visibility(request.getVisibility() == null ? Visibility.PUBLIC : request.getVisibility())
                .caption(blankToNull(request.getCaption()))
                .contentRich(blankToNull(request.getContentRich()))
                .moodTag(blankToNull(request.getMoodTag()))
                .refJson(blankToNull(request.getRefJson()))
                .commentsEnabled(request.getCommentsEnabled() == null || Boolean.TRUE.equals(request.getCommentsEnabled()))
                .shareCount(0L)
                .build();
        Post saved = postRepository.save(post);
        saveMediaIfPresent(saved, request);
        return feedService.getPost(email, saved.getId());
    }

    @Transactional
    public FeedPostResponse updatePost(String email, Long postId, PostMutationRequest request) {
        User user = currentUser(email);
        Post post = ownPost(user, postId);
        if (request.getType() != null) post.setType(request.getType());
        if (request.getVisibility() != null) post.setVisibility(request.getVisibility());
        post.setCaption(blankToNull(request.getCaption()));
        post.setContentRich(blankToNull(request.getContentRich()));
        post.setMoodTag(blankToNull(request.getMoodTag()));
        post.setRefJson(blankToNull(request.getRefJson()));
        if (request.getCommentsEnabled() != null) post.setCommentsEnabled(request.getCommentsEnabled());
        postRepository.save(post);
        postMediaRepository.deleteByPost_Id(post.getId());
        saveMediaIfPresent(post, request);
        return feedService.getPost(email, post.getId());
    }

    @Transactional
    public void deletePost(String email, Long postId) {
        User user = currentUser(email);
        Post post = ownPost(user, postId);
        commentRepository.deleteByPostId(post.getId());
        reactionRepository.deleteByTargetTypeAndTargetId(TargetType.POST, post.getId());
        postMediaRepository.deleteByPost_Id(post.getId());
        postRepository.delete(post);
    }

    @Transactional
    public FeedPostResponse toggleComments(String email, Long postId, boolean enabled) {
        User user = currentUser(email);
        Post post = ownPost(user, postId);
        post.setCommentsEnabled(enabled);
        postRepository.save(post);
        return feedService.getPost(email, postId);
    }

    @Transactional
    public FeedPostResponse react(String email, Long postId, PostReactionRequest request) {
        User user = currentUser(email);
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        ReactionType newType = request == null ? ReactionType.LIKE : request.getReactionType();
        reactionRepository.findByUser_IdAndTargetTypeAndTargetId(user.getId(), TargetType.POST, post.getId()).ifPresentOrElse(existing -> {
            if (newType == null || existing.getReactionType() == newType) {
                reactionRepository.delete(existing);
            } else {
                existing.setReactionType(newType);
                reactionRepository.save(existing);
            }
        }, () -> {
            if (newType != null) {
                reactionRepository.save(Reaction.builder()
                        .user(user)
                        .targetType(TargetType.POST)
                        .targetId(post.getId())
                        .reactionType(newType)
                        .build());
            }
        });
        return feedService.getPost(email, post.getId());
    }

    @Transactional
    public FeedCommentResponse comment(String email, Long postId, PostCommentRequest request) {
        User user = currentUser(email);
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        if (!Boolean.TRUE.equals(post.getCommentsEnabled())) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        String content = request == null ? null : blankToNull(request.getContent());
        if (content == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId()).orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        }
        Comment saved = commentRepository.save(Comment.builder()
                .post(post)
                .user(user)
                .parent(parent)
                .content(content)
                .build());
        return FeedCommentResponse.builder()
                .id(saved.getId())
                .text(saved.getContent())
                .createdAt(saved.getCreatedAt())
                .user(com.soundbook.dto.feed.FeedUserResponse.builder()
                        .userId(user.getId())
                        .displayName(user.getDisplayName())
                        .build())
                .build();
    }

    @Transactional
    public void deleteComment(String email, Long commentId) {
        User user = currentUser(email);
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        if (!Objects.equals(comment.getUser().getId(), user.getId()) && !Objects.equals(comment.getPost().getUser().getId(), user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        reactionRepository.deleteByTargetTypeAndTargetId(TargetType.COMMENT, comment.getId());
        commentRepository.delete(comment);
    }

    @Transactional
    public FeedPostResponse share(String email, Long postId, PostShareRequest request) {
        User user = currentUser(email);
        Post original = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        original.setShareCount((original.getShareCount() == null ? 0L : original.getShareCount()) + 1L);
        postRepository.save(original);
        String shareCaption = blankToNull(request == null ? null : request.getCaption());
        String refJson = buildSharedRefJson(original);
        Post share = postRepository.save(Post.builder()
                .user(user)
                .type(PostType.BLOG)
                .visibility(request == null || request.getVisibility() == null ? Visibility.PUBLIC : request.getVisibility())
                .caption(shareCaption == null ? "Đã chia sẻ một bài viết trên Soundbook." : shareCaption)
                .refJson(refJson)
                .commentsEnabled(true)
                .shareCount(0L)
                .build());
        return feedService.getPost(email, share.getId());
    }


    private String buildSharedRefJson(Post original) {
        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sharedPostId", original.getId());
            payload.put("sharedAuthor", original.getUser().getDisplayName());
            payload.put("sharedCaption", original.getCaption());
            return objectMapper.writeValueAsString(payload);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
    }

    private Post ownPost(User user, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST));
        if (!Objects.equals(post.getUser().getId(), user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        return post;
    }

    private User currentUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private void saveMediaIfPresent(Post post, PostMutationRequest request) {
        if (request.getMediaUrl() == null || request.getMediaUrl().isBlank()) return;
        postMediaRepository.save(PostMedia.builder()
                .post(post)
                .mediaType(request.getMediaType() == null ? MediaType.IMAGE : request.getMediaType())
                .url(request.getMediaUrl().trim())
                .build());
    }

    private String blankToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
