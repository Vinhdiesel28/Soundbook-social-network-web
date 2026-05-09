package com.soundbook.dto.social;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendActionResponse {
    private Long userId;
    private String friendshipStatus;
    private Long requestId;
    private Long dmThreadId;
    private boolean canMessage;
    private String message;
}
