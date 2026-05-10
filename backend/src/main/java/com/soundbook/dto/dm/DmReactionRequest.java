package com.soundbook.dto.dm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DmReactionRequest {
    @NotNull
    private Long userId;

    @NotBlank
    @Size(max = 32)
    private String reaction;
}
