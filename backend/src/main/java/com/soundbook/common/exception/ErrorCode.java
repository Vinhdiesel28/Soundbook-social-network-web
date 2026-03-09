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

    // Lỗi Tài nguyên (404)
    USER_NOT_FOUND(404, "User not found", HttpStatus.NOT_FOUND),
    POST_NOT_FOUND(404, "Post not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(404, "Room not found", HttpStatus.NOT_FOUND),

    // Lỗi Đăng nhập / Xác thực (401/403)
    UNAUTHENTICATED(401, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(403, "You do not have permission", HttpStatus.FORBIDDEN),
    BAD_CREDENTIALS(401, "Incorrect email or password", HttpStatus.UNAUTHORIZED),
    USER_MOVED(401, "User exists but please log in via Google", HttpStatus.UNAUTHORIZED),

    // Lỗi Xung đột dữ liệu / Logic (409/400)
    USER_EXISTED(400, "User with this email already exists", HttpStatus.BAD_REQUEST),
    ALREADY_FRIENDS(400, "You are already friends", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatus statusCode;
}
