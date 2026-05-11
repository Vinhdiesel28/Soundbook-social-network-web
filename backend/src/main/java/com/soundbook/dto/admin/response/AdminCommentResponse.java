package com.soundbook.dto.admin.response;

import com.soundbook.entity.enums.CommentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminCommentResponse
{
    private Long id;
    private Long postId;
    private Long authorId;
    private String authorName;
    private String authorAvatar;
    private String content;
    private Long parentId;
    private Long replyCount;
    private CommentStatus status;
    private LocalDateTime createdAt;
}