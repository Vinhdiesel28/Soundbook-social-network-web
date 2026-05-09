package com.soundbook.dto.dm;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DmThreadUpsertRequest {
    @NotNull
    private Long userId;

    @NotNull
    private Long peerUserId;
}
