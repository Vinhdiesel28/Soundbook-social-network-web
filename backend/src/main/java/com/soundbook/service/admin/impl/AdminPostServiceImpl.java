package com.soundbook.service.admin.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.admin.response.AdminCommentResponse;
import com.soundbook.dto.admin.response.AdminPostResponse;
import com.soundbook.dto.feed.FeedMediaResponse;
import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.dto.admin.response.ReactionResponse;
import com.soundbook.entity.Comment;
import com.soundbook.entity.Post;
import com.soundbook.entity.PostMedia;
import com.soundbook.entity.Reaction;
import com.soundbook.entity.enums.CommentStatus;
import com.soundbook.entity.enums.PostStatus;
import com.soundbook.entity.enums.ReactionType;
import com.soundbook.entity.enums.TargetType;
import com.soundbook.exception.ResourceNotFoundException;
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

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminPostServiceImpl implements AdminPostService
{
    private final PostRepository postRepository;
    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final com.soundbook.repository.PostMediaRepository postMediaRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

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

        Page<Reaction> reactionPage = reactionRepository.findByTargetIdAndTargetType(postId, TargetType.POST, pageable);

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

        Page<Reaction> reactionPage = reactionRepository.findByTargetIdAndTargetType(commentId, TargetType.COMMENT, pageable);

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

        // Use Admin method (includes deleted)
        Page<Comment> commentPage = commentRepository.findByPostIdAndParentIsNullOrderByCreatedAtDescAdmin(postId, pageable);

        Page<AdminCommentResponse> responsePage = commentPage.map(this::mapToAdminCommentResponse);

        return PageMapper.toPageResponse(responsePage);
    }

    @Override
    public java.util.List<AdminCommentResponse> getCommentReplies(Long commentId) {
        // Use Admin method (includes deleted)
        java.util.List<Comment> replies = commentRepository.findByParent_IdOrderByCreatedAtAscAdmin(commentId);
        
        return replies.stream()
                .map(this::mapToAdminCommentResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private AdminCommentResponse mapToAdminCommentResponse(Comment comment) {
        return AdminCommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .authorId(comment.getUser().getId())
                .authorName(comment.getUser().getDisplayName())
                .authorAvatar(comment.getUser().getProfile() != null ? comment.getUser().getProfile().getAvatarUrl() : null)
                .content(comment.getContent())
                .status(comment.getStatus())
                // Count ALL replies for admin
                .replyCount(commentRepository.countAllByParentId(comment.getId()))
                .createdAt(comment.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public void deleteComment(Long id)
    {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy comment"));

        comment.setStatus(CommentStatus.DELETED);
        commentRepository.save(comment);
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
                .contentRich(post.getContentRich())
                .refJson(post.getRefJson())
                .media(buildMediaResponse(post))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private FeedMediaResponse buildMediaResponse(Post post) {
        Optional<PostMedia> media = postMediaRepository.findFirstByPost_IdOrderByIdAsc(post.getId());
        RefPayload refPayload = parseRefPayload(post.getRefJson());
        return FeedMediaResponse.builder()
                .id(refPayload.id())
                .mediaType(media.map(item -> item.getMediaType().name()).orElse(null))
                .url(media.map(PostMedia::getUrl).orElse(null))
                .title(firstNonBlank(refPayload.title(), defaultMediaTitle(post)))
                .subtitle(firstNonBlank(refPayload.subtitle(), refPayload.artist(), refPayload.author()))
                .coverUrl(firstNonBlank(refPayload.coverUrl(), media.map(PostMedia::getUrl).orElse(null)))
                .rating(refPayload.rating())
                .build();
    }

    private String defaultMediaTitle(Post post) {
        if (post.getType() == com.soundbook.entity.enums.PostType.MUSIC_QUICK_NOTE) {
            return "Bài chia sẻ âm nhạc";
        }
        if (isBookPost(post.getType())) {
            return "Bài chia sẻ sách/truyện";
        }
        return "Bài viết Soundbook";
    }

    private boolean isBookPost(com.soundbook.entity.enums.PostType type) {
        return type == com.soundbook.entity.enums.PostType.BOOK_READING_UPDATE || type == com.soundbook.entity.enums.PostType.BOOK_QUOTE_CARD || type == com.soundbook.entity.enums.PostType.BOOK_REVIEW;
    }

    private String firstNonBlank(String... values) {
        if (values == null) return null;
        for (String value : values) {
            if (value != null && !value.isBlank()) return value;
        }
        return null;
    }

    private RefPayload parseRefPayload(Object refJsonObj) {
        if (refJsonObj == null) return RefPayload.empty();
        try {
            Map<String, Object> payload;
            if (refJsonObj instanceof Map) {
                payload = (Map<String, Object>) refJsonObj;
            } else {
                String refJson = String.valueOf(refJsonObj);
                if (refJson.isBlank()) return RefPayload.empty();
                payload = objectMapper.readValue(refJson, new TypeReference<LinkedHashMap<String, Object>>() {});
            }
            return new RefPayload(
                    textValue(payload, "id", "videoId", "itemId"),
                    textValue(payload, "title", "name", "bookTitle", "trackTitle"),
                    textValue(payload, "subtitle", "description"),
                    textValue(payload, "artist", "singer"),
                    textValue(payload, "author", "writer"),
                    textValue(payload, "coverUrl", "cover", "image", "imageUrl", "thumbnail"),
                    intValue(payload, "rating")
            );
        } catch (Exception e) {
            return RefPayload.empty();
        }
    }

    private String textValue(Map<String, Object> payload, String... keys) {
        for (String key : keys) {
            Object value = payload.get(key);
            if (value != null && !String.valueOf(value).isBlank()) return String.valueOf(value);
        }
        return null;
    }

    private Integer intValue(Map<String, Object> payload, String key) {
        Object value = payload.get(key);
        if (value == null) return null;
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private record RefPayload(String id, String title, String subtitle, String artist, String author, String coverUrl, Integer rating) {
        static RefPayload empty() {
            return new RefPayload(null, null, null, null, null, null, null);
        }
    }
}
