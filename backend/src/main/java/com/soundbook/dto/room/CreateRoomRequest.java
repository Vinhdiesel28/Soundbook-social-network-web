package com.soundbook.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRoomRequest {

    @NotNull
    private Long hostUserId;

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 200)
    private String topic;

    private Boolean isPublic;
}
