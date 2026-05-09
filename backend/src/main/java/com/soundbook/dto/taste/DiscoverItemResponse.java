package com.soundbook.dto.taste;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscoverItemResponse {
    private String type;
    private String title;
    private String subtitle;
    private String reason;
    private double score;
}
