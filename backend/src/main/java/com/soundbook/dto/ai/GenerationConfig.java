package com.soundbook.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenerationConfig
{
    private Double temperature;
    private Integer maxOutputTokens;
}
