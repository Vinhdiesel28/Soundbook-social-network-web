package com.soundbook.service;

import com.soundbook.dto.request.UpdateProfileRequest;
import com.soundbook.dto.response.UserMeResponse;
import com.soundbook.entity.User;
import com.soundbook.entity.UserProfile;
import com.soundbook.repository.UserProfileRepository;
import com.soundbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    // Lấy thông tin User đang đăng nhập
    public UserMeResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        UserProfile profile = userProfileRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile không tồn tại"));

        return UserMeResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .role(user.getRole().name())
                .avatarUrl(profile.getAvatarUrl())
                .username(profile.getUsername())
                .build();
    }

    // Cập nhật Profile
    @Transactional
    public UserMeResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        UserProfile profile = userProfileRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile không tồn tại"));

        // Cập nhật User
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
            userRepository.save(user);
        }

        // Cập nhật Profile
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getCoverUrl() != null) profile.setCoverUrl(request.getCoverUrl());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getThemeMode() != null) profile.setThemeMode(request.getThemeMode());
        if (request.getPinnedTrackId() != null) profile.setPinnedTrackId(request.getPinnedTrackId());
        if (request.getAllowPreviewPlayer() != null) profile.setAllowPreviewPlayer(request.getAllowPreviewPlayer());

        userProfileRepository.save(profile);

        return getCurrentUser(email);
    }
}