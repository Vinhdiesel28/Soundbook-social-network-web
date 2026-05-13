package com.soundbook.dto.room;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ActiveRoomResponse {
    private Long roomId;
    private String name;
    private String topic;
    private Long hostUserId;
    private String hostDisplayName;
    private String hostAvatarUrl;
    private Long listenersCount;
    private String status;
    private LocalDateTime createdAt;
    private RoomPlaybackStateResponse state;
}
