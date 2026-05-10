package com.soundbook.dto.socialcontent;

import com.soundbook.entity.enums.ReactionType;
import lombok.Data;

@Data
public class PostReactionRequest {
    private ReactionType reactionType;
}
