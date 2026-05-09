package com.soundbook.dto.socialcontent;

import com.soundbook.entity.enums.MediaType;
import com.soundbook.entity.enums.PostType;
import com.soundbook.entity.enums.Visibility;
import lombok.Data;

@Data
public class PostMutationRequest {
    private PostType type;
    private Visibility visibility;
    private String caption;
    private String contentRich;
    private String moodTag;
    private String refJson;
    private String mediaUrl;
    private MediaType mediaType;
    private Boolean commentsEnabled;
}
