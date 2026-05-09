package com.soundbook.dto.profile;

import com.soundbook.dto.feed.FeedPostResponse;
import com.soundbook.dto.social.FriendUserResponse;
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
public class ProfileResponse {
    private Long userId;
    private String displayName;
    private String email;
    private String username;
    private String avatarUrl;
    private String coverUrl;
    private String bio;
    private String publicInfo;
    private String bioVisibility;
    private String publicInfoVisibility;
    private String pinnedTrackId;
    private String pinnedTrackVisibility;
    private boolean allowPreviewPlayer;
    private ProfileStatsResponse stats;
    private double matchScore;
    private List<String> sharedFeatures;
    private String friendshipStatus;
    private boolean following;
    private Long friendRequestId;
    private boolean canMessage;
    private List<FriendUserResponse> friendsPreview;
    private List<ProfileShelfResponse> shelves;
    private List<FeedPostResponse> posts;
    private LocalDateTime updatedAt;
}
