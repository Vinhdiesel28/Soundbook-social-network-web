package com.soundbook.dto.feed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedCommentResponse {
    private Long id;
    private Long parentId;
    private FeedUserResponse user;
    private String text;
    private LocalDateTime createdAt;
    private long reactsCount;
    private long replyCount;
    private String currentUserReaction;
}
