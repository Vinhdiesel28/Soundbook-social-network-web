package com.soundbook.dto.profile;

import com.soundbook.entity.enums.Visibility;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String displayName;
    private String username;
    private String bio;
    private String publicInfo;
    private Visibility bioVisibility;
    private Visibility publicInfoVisibility;
    private String avatarUrl;
    private String coverUrl;
    private String pinnedTrackId;
    private Visibility pinnedTrackVisibility;
    private Boolean allowPreviewPlayer;
}
