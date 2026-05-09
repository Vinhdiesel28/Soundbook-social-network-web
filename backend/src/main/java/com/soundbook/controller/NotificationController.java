package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.notification.MarkNotificationReadRequest;
import com.soundbook.dto.notification.NotificationCursorPageResponse;
import com.soundbook.dto.notification.NotificationResponse;
import com.soundbook.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get paginated notifications for a user with cursor pagination.
     * Usage:
     * - First call: GET /api/v1/notifications?userId=123 (no cursor)
     * - Next page: GET /api/v1/notifications?userId=123&cursor={nextCursor}&limit=20
     */
    @GetMapping
    public ApiResponse<NotificationCursorPageResponse> getNotifications(
            @RequestParam Long userId,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.success(
                notificationService.getNotifications(userId, cursor, limit)
        );
    }

    /**
     * Get count of unread notifications for a user.
     */
    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount(@RequestParam Long userId) {
        return ApiResponse.success(
                notificationService.getUnreadCount(userId)
        );
    }

    /**
     * Mark a notification as read/unread.
     * Request body: { "notificationId": 123, "isRead": true }
     */
    @PutMapping("/{notificationId}/read")
    public ApiResponse<NotificationResponse> markAsRead(
            @PathVariable Long notificationId,
            @Valid @RequestBody MarkNotificationReadRequest request) {
        return ApiResponse.success(
            notificationService.markAsRead(notificationId, request.getIsRead())
        );
    }

    /**
     * Delete a notification.
     */
    @DeleteMapping("/{notificationId}")
    public ApiResponse<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ApiResponse.success(null);
    }

    /**
     * Mark all notifications as read for a user.
     */
    @PostMapping("/mark-all-read")
    public ApiResponse<Void> markAllAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
        return ApiResponse.success(null);
    }
}
