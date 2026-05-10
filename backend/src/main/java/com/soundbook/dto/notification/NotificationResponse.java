package com.soundbook.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String type;                    // LIKE, COMMENT, FOLLOW, FRIEND_REQUEST, ROOM_INVITE, MATCH
    private String targetType;              // POST, COMMENT, ROOM, USER, DM_THREAD
    private Long targetId;
    private String content;
    private Long actorUserId;
    private String actorDisplayName;
    private String actorAvatarUrl;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
