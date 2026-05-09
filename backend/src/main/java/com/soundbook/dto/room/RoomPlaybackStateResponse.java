package com.soundbook.dto.room;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RoomPlaybackStateResponse {
    private String trackId;
    private String trackPayloadJson;
    private Integer positionMs;
    private Boolean isPlaying;
    private LocalDateTime updatedAt;
    private Long updatedByUserId;
}
