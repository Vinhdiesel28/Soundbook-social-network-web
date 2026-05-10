package com.soundbook.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomMessageSendRequest {

    @NotNull
    private Long senderUserId;

    @NotBlank
    private String contentText;
}
