package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.social.FriendActionResponse;
import com.soundbook.dto.social.FriendListResponse;
import com.soundbook.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @GetMapping
    public ResponseEntity<ApiResponse<FriendListResponse>> getFriends(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(friendService.getFriendHub(authentication.getName())));
    }

    @PostMapping("/requests/{receiverId}")
    public ResponseEntity<ApiResponse<FriendActionResponse>> sendRequest(Authentication authentication, @PathVariable Long receiverId) {
        return ResponseEntity.ok(ApiResponse.success(friendService.sendRequest(authentication.getName(), receiverId)));
    }

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<ApiResponse<FriendActionResponse>> acceptRequest(Authentication authentication, @PathVariable Long requestId) {
        return ResponseEntity.ok(ApiResponse.success(friendService.acceptRequest(authentication.getName(), requestId)));
    }

    @PostMapping("/requests/{requestId}/decline")
    public ResponseEntity<ApiResponse<FriendActionResponse>> declineRequest(Authentication authentication, @PathVariable Long requestId) {
        return ResponseEntity.ok(ApiResponse.success(friendService.declineRequest(authentication.getName(), requestId)));
    }

    @DeleteMapping("/requests/{requestId}")
    public ResponseEntity<ApiResponse<FriendActionResponse>> cancelRequest(Authentication authentication, @PathVariable Long requestId) {
        return ResponseEntity.ok(ApiResponse.success(friendService.cancelRequest(authentication.getName(), requestId)));
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<ApiResponse<FriendActionResponse>> removeFriend(Authentication authentication, @PathVariable Long friendId) {
        return ResponseEntity.ok(ApiResponse.success(friendService.removeFriend(authentication.getName(), friendId)));
    }

    @PostMapping("/{friendId}/chat")
    public ResponseEntity<ApiResponse<FriendActionResponse>> startChat(Authentication authentication, @PathVariable Long friendId) {
        return ResponseEntity.ok(ApiResponse.success(friendService.startChat(authentication.getName(), friendId)));
    }
}
