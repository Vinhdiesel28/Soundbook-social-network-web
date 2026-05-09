package com.soundbook.dto.dm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DmShareRequest {
    @NotNull
    private Long senderUserId;

    @NotBlank
    @Size(max = 50)
    private String shareType;

    @NotBlank
    private String shareRef;

    private String note;
}
