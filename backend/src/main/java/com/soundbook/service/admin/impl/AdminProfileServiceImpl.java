package com.soundbook.service.admin.impl;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.admin.request.AdminUpdateProfileRequest;
import com.soundbook.dto.common.request.ChangePasswordRequest;
import com.soundbook.dto.admin.response.AdminProfileResponse;
import com.soundbook.entity.User;
import com.soundbook.entity.UserProfile;
import com.soundbook.exception.ResourceNotFoundException;
import com.soundbook.repository.UserRepository;
import com.soundbook.service.admin.AdminProfileService;
import com.soundbook.service.admin.FileUploadService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AdminProfileServiceImpl implements AdminProfileService
{
    private final UserRepository userRepository;
    private final FileUploadService fileUploadService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminProfileResponse getMyProfile(String email)
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản hợp lệ!"));

        UserProfile profile = user.getProfile();

        return AdminProfileResponse.builder()
                .id(user.getId())
                .displayName(user.getDisplayName())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(profile != null ? profile.getAvatarUrl() : "")
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public void updateProfile(String email, AdminUpdateProfileRequest request)
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setDisplayName(request.getDisplayName());
        userRepository.save(user);
    }

    @Transactional
    public String updateAvatar(String email, MultipartFile file) throws IOException
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAvatarUrl = fileUploadService.uploadFile(file, "avatars");

        if (user.getProfile().getAvatarUrl() != null)
        {
            fileUploadService.deleteFile(user.getProfile().getAvatarUrl());
        }

        user.getProfile().setAvatarUrl(newAvatarUrl);
        userRepository.save(user);

        return newAvatarUrl;
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request)
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash()))
        {
            throw new AppException(ErrorCode.OLD_PASSWORD_INCORRECT);
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword()))
        {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCHED);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
