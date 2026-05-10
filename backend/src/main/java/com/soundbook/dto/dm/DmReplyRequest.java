package com.soundbook.dto.dm;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DmReplyRequest {
    @NotNull
    private Long senderUserId;

    @Size(max = 5000)
    private String contentText;

    private String cardPayloadJson;
}
