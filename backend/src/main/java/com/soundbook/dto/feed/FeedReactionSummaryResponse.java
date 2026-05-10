package com.soundbook.dto.feed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedReactionSummaryResponse {
    private long like;
    private long heart;
    private long fire;
    private long laugh;
    private long wow;
    private long sad;
    private long comments;
    private long shares;
}
