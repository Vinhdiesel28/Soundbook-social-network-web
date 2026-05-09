package com.soundbook.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserMeResponse {
    private Long id;
    private String email;
    private String displayName;
    private String role;
    private String avatarUrl;
    private String username;
    private Boolean onboardingCompleted;
}