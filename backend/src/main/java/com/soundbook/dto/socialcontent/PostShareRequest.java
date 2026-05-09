package com.soundbook.dto.socialcontent;

import com.soundbook.entity.enums.Visibility;
import lombok.Data;

@Data
public class PostShareRequest {
    private String caption;
    private Visibility visibility;
}
