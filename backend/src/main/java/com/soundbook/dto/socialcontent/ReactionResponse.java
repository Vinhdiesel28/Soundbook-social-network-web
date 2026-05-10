package com.soundbook.dto.socialcontent;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReactionResponse
{
    private Long reactionId;
    private String reactionType;
    private Long userId;
    private String fullName;
    private String avatarUrl;
    private LocalDateTime createdAt;
}
