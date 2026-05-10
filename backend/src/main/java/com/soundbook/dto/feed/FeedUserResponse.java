package com.soundbook.dto.feed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedUserResponse {
    private Long userId;
    private String displayName;
    private String username;
    private String avatarUrl;
}
