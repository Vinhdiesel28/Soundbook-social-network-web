package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.common.request.GoogleLoginRequest;
import com.soundbook.dto.common.request.LoginRequest;
import com.soundbook.dto.common.request.RegisterRequest;
import com.soundbook.dto.common.response.AuthResponse;
import com.soundbook.dto.common.response.UserMeResponse;
import com.soundbook.service.AuthService;
import com.soundbook.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .code(200)
                .message("Login successful")
                .data(response)
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .code(200)
                .message("Register successful")
                .data(response)
                .build());
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        AuthResponse response = authService.loginWithGoogle(request.getIdToken());
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .code(200)
                .message("Google Login successful")
                .data(response)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserMeResponse>> me(Authentication authentication) {
        UserMeResponse response = userService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.<UserMeResponse>builder()
                .code(200)
                .message("Fetched current user successfully")
                .data(response)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            Authentication authentication,
            @RequestHeader(name = "Authorization", required = false) String authorizationHeader
    ) {
        authService.logout(authentication != null ? authentication.getName() : null, authorizationHeader);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .code(200)
                .message("Logout successful")
                .build());
    }
}
