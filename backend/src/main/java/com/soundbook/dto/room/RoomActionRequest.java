package com.soundbook.dto.room;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomActionRequest {

    @NotNull
    private Long userId;
}
