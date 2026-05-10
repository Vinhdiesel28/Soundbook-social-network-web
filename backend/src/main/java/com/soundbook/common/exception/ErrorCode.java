package com.soundbook.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // Lỗi hệ thống chung (500)
    UNCATEGORIZED_EXCEPTION(500, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),

    // Lỗi Client vớ vẩn (400)
    INVALID_KEY(400, "Uncategorized error key", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(400, "Invalid request body or parameters", HttpStatus.BAD_REQUEST),
    INVALID_OAUTH_STATE(400, "Invalid or expired OAuth state", HttpStatus.BAD_REQUEST),
    SPOTIFY_NOT_CONNECTED(400, "Spotify account is not connected", HttpStatus.BAD_REQUEST),

    // Lỗi Tài nguyên (404)
    USER_NOT_FOUND(404, "User not found", HttpStatus.NOT_FOUND),
    POST_NOT_FOUND(404, "Post not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(404, "Room not found", HttpStatus.NOT_FOUND),
    ROOM_MEMBER_NOT_FOUND(404, "Room member not found", HttpStatus.NOT_FOUND),
    ROOM_QUEUE_ITEM_NOT_FOUND(404, "Room queue item not found", HttpStatus.NOT_FOUND),
    NOTIFICATION_NOT_FOUND(404, "Notification not found", HttpStatus.NOT_FOUND),
    DM_THREAD_NOT_FOUND(404, "DM thread not found", HttpStatus.NOT_FOUND),
    DM_THREAD_ACCESS_DENIED(403, "You do not have access to this DM thread", HttpStatus.FORBIDDEN),
    DM_MESSAGE_NOT_FOUND(404, "DM message not found", HttpStatus.NOT_FOUND),

    // Lỗi Đăng nhập / Xác thực (401/403)
    UNAUTHENTICATED(401, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(403, "You do not have permission", HttpStatus.FORBIDDEN),
    BAD_CREDENTIALS(401, "Incorrect email or password", HttpStatus.UNAUTHORIZED),
    USER_BANNED(403, "Tài khoản của bạn đã bị cấm truy cập. Vui lòng liên hệ quản trị viên.", HttpStatus.FORBIDDEN),
    USER_MOVED(401, "User exists but please log in via Google", HttpStatus.UNAUTHORIZED),

    // Lỗi Xung đột dữ liệu / Logic (409/400)
    USER_EXISTED(400, "User with this email already exists", HttpStatus.BAD_REQUEST),
    ALREADY_FRIENDS(400, "You are already friends", HttpStatus.BAD_REQUEST),
    ROOM_ALREADY_JOINED(400, "User already joined this room", HttpStatus.BAD_REQUEST),
    ROOM_ALREADY_ENDED(400, "Room is already ended", HttpStatus.BAD_REQUEST),
    SPOTIFY_ACCOUNT_ALREADY_LINKED(409, "This Spotify account is already linked to another user", HttpStatus.CONFLICT),
    INVALID_CURSOR(400, "Invalid cursor", HttpStatus.BAD_REQUEST),
    INVALID_DELETE_MODE(400, "Invalid delete mode", HttpStatus.BAD_REQUEST),
    DM_DELETE_FORBIDDEN(403, "You cannot delete this message for everyone", HttpStatus.FORBIDDEN),

    OLD_PASSWORD_INCORRECT(400, "Mật khẩu hiện tại không chính xác", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_MATCHED(400, "Xác nhận mật khẩu không khớp với mật khẩu mới", HttpStatus.BAD_REQUEST),

    THREAD_NOT_FOUND(404, "Không tìm thấy cuộc hội thoại", HttpStatus.NOT_FOUND),
    MESSAGE_NOT_FOUND(404, "Không tìm thấy tin nhắn", HttpStatus.NOT_FOUND),

    ALREADY_REPORTED(400, "Bạn đã báo cáo nội dung này rồi. Vui lòng chờ quản trị viên xử lý!", HttpStatus.BAD_REQUEST),
    REPORT_NOT_FOUND(404, "Không tìm thấy báo cáo", HttpStatus.NOT_FOUND);


    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatus statusCode;
}
