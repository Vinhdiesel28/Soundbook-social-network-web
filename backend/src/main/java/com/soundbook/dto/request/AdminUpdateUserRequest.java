package com.soundbook.dto.request;

import com.soundbook.entity.enums.UserRole;
import com.soundbook.entity.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateUserRequest
{
    private UserRole role;
    private UserStatus status;

    private boolean removeAvatar;
    private boolean removeCover;
    private boolean removeBio;

    private String displayName;
}
