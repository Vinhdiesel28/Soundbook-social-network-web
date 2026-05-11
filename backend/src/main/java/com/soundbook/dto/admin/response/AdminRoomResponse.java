package com.soundbook.dto.admin.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminRoomResponse
{
    private Long id;
    private String name;
    private String topic;
    private String hostName;
    private boolean isPublic;
    private String status;
    private Integer memberCount;
    private LocalDateTime createdAt;
    private LocalDateTime endedAt;
}
