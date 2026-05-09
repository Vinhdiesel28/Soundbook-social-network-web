package com.soundbook.service;

import com.soundbook.dto.notification.NotificationCursorPageResponse;
import com.soundbook.dto.notification.NotificationResponse;

public interface NotificationService {

    /**
     * Get paginated notifications for a user with cursor support.
     * @param userId recipient user ID
     * @param cursor "{createdAt}|{id}" or null for first page
     * @param limit max 100, default 20
     * @return paginated response with nextCursor
     */
    NotificationCursorPageResponse getNotifications(Long userId, String cursor, int limit);

    /**
     * Mark a single notification as read/unread.
     */
    NotificationResponse markAsRead(Long notificationId, Boolean isRead);

    /**
     * Delete a notification.
     */
    void deleteNotification(Long notificationId);

    /**
     * Get count of unread notifications.
     */
    long getUnreadCount(Long userId);

    /**
     * Mark all notifications as read for a user.
     */
    void markAllAsRead(Long userId);
}
