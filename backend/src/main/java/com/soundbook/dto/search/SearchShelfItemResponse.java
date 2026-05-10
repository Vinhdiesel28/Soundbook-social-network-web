package com.soundbook.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchShelfItemResponse {
    private Long id;
    private String type;
    private String title;
    private String subtitle;
    private String coverUrl;
    private Long ownerUserId;
    private String ownerDisplayName;
}
