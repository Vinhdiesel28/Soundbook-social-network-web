package com.soundbook.dto.socialcontent;

import lombok.Data;

@Data
public class PostCommentRequest {
    private String content;
    private Long parentId;
}
