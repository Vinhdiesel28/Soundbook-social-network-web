package com.soundbook.dto.room;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RoomMessageResponse {
    private Long messageId;
    private Long roomId;
    private Long senderUserId;
    private String senderDisplayName;
    private String contentText;
    private LocalDateTime createdAt;
}
