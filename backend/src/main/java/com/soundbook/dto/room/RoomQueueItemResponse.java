package com.soundbook.dto.room;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RoomQueueItemResponse {
    private Long id;
    private Long roomId;
    private String trackId;
    private String trackPayloadJson;
    private Long addedByUserId;
    private String addedByDisplayName;
    private Integer voteCount;
    private Integer positionOrder;
    private LocalDateTime playedAt;
    private LocalDateTime createdAt;
}
