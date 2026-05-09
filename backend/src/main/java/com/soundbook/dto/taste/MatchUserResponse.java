package com.soundbook.dto.taste;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchUserResponse {
    private Long userId;
    private String displayName;
    private String username;
    private String avatarUrl;
    private double musicSimilarity;
    private double bookSimilarity;
    private double baseMatch;
    private double conflictPenalty;
    private double finalMatch;
    private List<String> sharedFeatures;
}
