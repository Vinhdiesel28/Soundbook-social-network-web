package com.soundbook.dto.youtube;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouTubeVideoResponse {
    private String videoId;
    private String title;
    private String description;
    private String thumbnail;
    private String channelTitle;
    private String publishedAt;
    private Integer durationSeconds; // for details endpoint
}
