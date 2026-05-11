package com.soundbook.dto.admin.response;

import com.soundbook.dto.feed.FeedMediaResponse;
import com.soundbook.entity.enums.PostStatus;
import com.soundbook.entity.enums.PostType;
import com.soundbook.entity.enums.Visibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
    private String contentRich;
    private String refJson;
    private FeedMediaResponse media;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
