package com.soundbook.service;

import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.dto.socialcontent.ReactionResponse;
import com.soundbook.entity.enums.TargetType;

public interface ReactionService
{
    PageResponse<ReactionResponse> getReactionsByTargetId(Long targetId, TargetType targetType, int page, int size);
}
