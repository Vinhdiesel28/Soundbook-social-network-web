package com.soundbook.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationCursorPageResponse {
    private List<NotificationResponse> items;
    private String nextCursor;  // null if no more results, "{createdAt}|{id}" format
}
