package com.soundbook.dto.admin.response;

import com.soundbook.entity.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminProfileResponse
{
    private Long id;
    private String displayName;
    private String email;
    private UserRole role;
    private String avatarUrl;
    private LocalDateTime updatedAt;
}
