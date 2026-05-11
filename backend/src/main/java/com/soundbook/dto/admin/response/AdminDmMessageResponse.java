package com.soundbook.dto.admin.response;

import com.soundbook.entity.enums.MessageType;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminDmMessageResponse
{
    private Long id;
    private Long threadId;
    private Long senderId;
    private String senderName;
    private MessageType messageType;
    private String contentText;
    private String cardPayloadJson;
    private Long replyToMessageId;
    private boolean deletedForEveryone;
    private LocalDateTime createdAt;
}