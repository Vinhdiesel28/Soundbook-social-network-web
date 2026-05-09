package com.soundbook.dto.profile;

import com.soundbook.entity.enums.CollectionItemType;
import com.soundbook.entity.enums.Visibility;
import lombok.Data;

@Data
public class MusicShelfRequest {
    private CollectionItemType itemType;
    private String itemId;
    private String title;
    private String subtitle;
    private String coverUrl;
    private String previewUrl;
    private Visibility visibility;
    private Integer sortOrder;
}
