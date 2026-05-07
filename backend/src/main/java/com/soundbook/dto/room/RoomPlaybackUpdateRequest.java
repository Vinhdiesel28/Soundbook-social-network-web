package com.soundbook.dto.room;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomPlaybackUpdateRequest {

    @NotNull
    private Long updatedByUserId;

    private String trackId;

    private String trackPayloadJson;

    @NotNull
    private Integer positionMs;

    @NotNull
    private Boolean isPlaying;
}
