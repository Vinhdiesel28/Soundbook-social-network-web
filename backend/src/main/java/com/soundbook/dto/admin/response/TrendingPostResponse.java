package com.soundbook.dto.admin.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrendingPostResponse
{
    private Long id;
    private String authorName;
    private String authorAvatar;
    private String caption;
    private String postType;
    private long likeCount;
    private long commentCount;
}