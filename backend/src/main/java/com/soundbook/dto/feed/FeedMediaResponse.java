package com.soundbook.dto.feed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedMediaResponse {
    private String mediaType;
    private String url;
    private String title;
    private String subtitle;
    private String coverUrl;
    private Integer rating;
}
