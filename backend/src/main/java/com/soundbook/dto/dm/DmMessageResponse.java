package com.soundbook.dto.dm;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
public class DmMessageResponse {
    private Long messageId;
    private Long threadId;
    private Long senderUserId;
    private String senderDisplayName;
    private String senderAvatarUrl;
    private String messageType;
    private String contentText;
    private String cardPayloadJson;
    private Long replyToMessageId;
    private LocalDateTime createdAt;
    private Map<String, Long> reactions;
}
