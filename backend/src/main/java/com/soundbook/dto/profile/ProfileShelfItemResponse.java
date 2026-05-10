package com.soundbook.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileShelfItemResponse {
    private Long id;
    private String type;
    private String title;
    private String author;
    private String image;
    private String itemId;
    private String previewUrl;
    private String visibility;
    private Integer rating;
    private Integer progress;
}
