package com.soundbook.dto.room;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomMemberResponse {
    private Long userId;
    private String displayName;
    private String avatarUrl;
    private String role;
}
