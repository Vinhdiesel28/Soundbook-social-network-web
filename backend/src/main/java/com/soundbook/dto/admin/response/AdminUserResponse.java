package com.soundbook.dto.admin.response;

import com.soundbook.entity.enums.UserRole;
import com.soundbook.entity.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserResponse
{
    private Long id;
    private String email;
    private String displayName;
    private String googleSub;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
