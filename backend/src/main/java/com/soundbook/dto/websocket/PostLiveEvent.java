package com.soundbook.dto.websocket;

import com.soundbook.entity.enums.LiveEventType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostLiveEvent
{
    private LiveEventType eventType;
    private Long actorId;
    private Object payload;
}