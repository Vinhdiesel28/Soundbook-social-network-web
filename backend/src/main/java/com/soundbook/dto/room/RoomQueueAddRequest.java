package com.soundbook.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomQueueAddRequest {

    @NotNull
    private Long addedByUserId;

    @NotBlank
    private String trackId;

    @NotBlank
    private String trackPayloadJson;
}
