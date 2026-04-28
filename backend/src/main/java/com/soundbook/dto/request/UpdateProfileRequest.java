package com.soundbook.dto.request;

import com.soundbook.entity.enums.ThemeMode;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String displayName;
    private String avatarUrl;
    private String coverUrl;
    private String bio;
    private ThemeMode themeMode;
    private String pinnedTrackId;
    private Boolean allowPreviewPlayer;
}