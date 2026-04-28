package com.soundbook.dto.dm;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DmThreadResponse {
    private Long threadId;
    private Long peerUserId;
    private String peerDisplayName;
    private String peerAvatarUrl;
    private String lastMessagePreview;
    private LocalDateTime updatedAt;
}
