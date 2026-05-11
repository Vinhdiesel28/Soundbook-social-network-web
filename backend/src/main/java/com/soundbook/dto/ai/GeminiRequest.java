package com.soundbook.dto.ai;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GeminiRequest
{
    private List<Content> contents;
    private GenerationConfig generationConfig;
}