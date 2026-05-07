package com.soundbook.controller;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.request.AdminUpdateProfileRequest;
import com.soundbook.dto.request.ChangePasswordRequest;
import com.soundbook.dto.response.AdminProfileResponse;
import com.soundbook.dto.response.ApiResponse;
import com.soundbook.security.JwtService;
import com.soundbook.service.admin.AdminProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController
{
    private final AdminProfileService adminProfileService;
    private final JwtService jwtService;

    private String getEmailFromHeader(String authHeader)
    {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String token = authHeader.substring(7);
        return jwtService.extractUsername(token);
    }

    @GetMapping
    public ResponseEntity<?> getMyProfile(@RequestHeader("Authorization") String authHeader)
    {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
        {
            return ResponseEntity.status(401).body("Token không hợp lệ hoặc bị thiếu");
        }

        String jwtTokenString = authHeader.substring(7);
        String email = jwtService.extractUsername(jwtTokenString);
        return ResponseEntity.ok(adminProfileService.getMyProfile(email));
    }

    @PutMapping("")
    public ResponseEntity<ApiResponse<Void>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AdminUpdateProfileRequest request)
    {
        String email = getEmailFromHeader(authHeader);
        adminProfileService.updateProfile(email, request);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Cập nhật thông tin thành công")
                .build());
    }

    @PostMapping("/avatar")
    public ResponseEntity<ApiResponse<String>> updateAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) throws IOException
    {
        String email = getEmailFromHeader(authHeader);
        String avatarUrl = adminProfileService.updateAvatar(email, file);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .message("Cập nhật ảnh đại diện thành công")
                .data(avatarUrl) // Front-end dùng data này để load lại ảnh mới ngay lập tức
                .build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody ChangePasswordRequest request) {

        String email = getEmailFromHeader(authHeader);
        adminProfileService.changePassword(email, request);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đổi mật khẩu thành công")
                .build());
    }
}
