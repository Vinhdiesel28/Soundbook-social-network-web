package com.soundbook.dto.social;

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
public class FriendUserResponse {
    private Long userId;
    private String displayName;
    private String username;
    private String avatarUrl;
    private String bio;
    private double matchScore;
    private List<String> sharedFeatures;
    private String friendshipStatus;
    private Long requestId;
    private boolean canMessage;
    private LocalDateTime connectedAt;
}
