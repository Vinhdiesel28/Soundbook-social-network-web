package com.soundbook.dto.response;

import com.soundbook.entity.enums.PostStatus;
import com.soundbook.entity.enums.PostType;
import com.soundbook.entity.enums.Visibility;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminPostResponse
{
    private Long id;
    private Long authorId;
    private String authorName;
    private String authorEmail;
    private PostType type;
    private Visibility visibility;
    private PostStatus status;
    private String caption;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
