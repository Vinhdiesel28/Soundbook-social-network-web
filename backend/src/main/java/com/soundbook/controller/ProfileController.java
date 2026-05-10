package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.profile.BookShelfRequest;
import com.soundbook.dto.profile.MusicShelfRequest;
import com.soundbook.dto.profile.ProfileResponse;
import com.soundbook.dto.profile.ProfileUpdateRequest;
import com.soundbook.service.ProfileMutationService;
import com.soundbook.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final ProfileMutationService profileMutationService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(Authentication authentication, @PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(profileService.getProfile(authentication.getName(), userId)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateMyProfile(Authentication authentication, @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.updateProfile(authentication.getName(), request)));
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<ProfileResponse>> followProfile(Authentication authentication, @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.followProfile(authentication.getName(), userId)));
    }

    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<ProfileResponse>> unfollowProfile(Authentication authentication, @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.unfollowProfile(authentication.getName(), userId)));
    }

    @PostMapping("/me/music")
    public ResponseEntity<ApiResponse<ProfileResponse>> createMusic(Authentication authentication, @RequestBody MusicShelfRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.createMusic(authentication.getName(), request)));
    }

    @PutMapping("/me/music/{itemId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateMusic(Authentication authentication, @PathVariable Long itemId, @RequestBody MusicShelfRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.updateMusic(authentication.getName(), itemId, request)));
    }

    @DeleteMapping("/me/music/{itemId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> deleteMusic(Authentication authentication, @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.deleteMusic(authentication.getName(), itemId)));
    }

    @PostMapping("/me/books")
    public ResponseEntity<ApiResponse<ProfileResponse>> createBook(Authentication authentication, @RequestBody BookShelfRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.createBook(authentication.getName(), request)));
    }

    @PutMapping("/me/books/{itemId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateBook(Authentication authentication, @PathVariable Long itemId, @RequestBody BookShelfRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.updateBook(authentication.getName(), itemId, request)));
    }

    @DeleteMapping("/me/books/{itemId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> deleteBook(Authentication authentication, @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success(profileMutationService.deleteBook(authentication.getName(), itemId)));
    }
}
