package com.soundbook.dto.feed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedPostResponse {
    private Long id;
    private String type;
    private String caption;
    private String contentRich;
    private String moodTag;
    private String refJson;
    private FeedUserResponse user;
    private FeedMediaResponse media;
    private FeedReactionSummaryResponse reactions;
    private List<FeedCommentResponse> comments;
    private boolean commentsEnabled;
    private String currentUserReaction;
    private boolean canEdit;
    private double tasteScore;
    private double authorMatch;
    private double finalScore;
    private String reason;
    private LocalDateTime createdAt;
}
