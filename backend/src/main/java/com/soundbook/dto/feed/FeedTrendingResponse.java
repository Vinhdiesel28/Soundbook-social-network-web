package com.soundbook.dto.feed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedTrendingResponse {
    private Long postId;
    private String title;
    private String subtitle;
    private String type;
    private long engagementCount;
}
