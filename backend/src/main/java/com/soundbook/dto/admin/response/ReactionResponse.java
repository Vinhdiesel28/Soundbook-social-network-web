package com.soundbook.dto.admin.response;

import com.soundbook.entity.enums.ReactionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReactionResponse
{
    private Long id;
    private Long userId;
    private String userName;
    private String avatarUrl;
    private ReactionType type;
    private LocalDateTime createdAt;
}