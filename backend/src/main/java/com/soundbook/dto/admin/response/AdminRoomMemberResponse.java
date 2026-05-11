package com.soundbook.dto.admin.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminRoomMemberResponse
{
    private Long userId;
    private String displayName;
    private String role;
    private boolean isBanned;
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;
}