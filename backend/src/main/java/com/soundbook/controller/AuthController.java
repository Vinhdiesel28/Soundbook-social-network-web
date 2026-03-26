package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.request.GoogleLoginRequest;
import com.soundbook.dto.request.LoginRequest;
import com.soundbook.dto.request.RegisterRequest;
import com.soundbook.dto.response.AuthResponse;
import com.soundbook.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .code(200)
                .message("Login successful")
                .data(response)
                .build());
    }

    // THÊM API REGISTER
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
}