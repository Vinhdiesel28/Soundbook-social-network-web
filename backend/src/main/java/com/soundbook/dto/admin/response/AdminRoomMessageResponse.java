package com.soundbook.dto.admin.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRoomMessageResponse
{
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private String contentType;
    private String contentText;
    private LocalDateTime createdAt;
}