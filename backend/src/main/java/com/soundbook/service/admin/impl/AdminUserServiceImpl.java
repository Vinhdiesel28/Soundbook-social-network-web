package com.soundbook.service.admin.impl;

import com.soundbook.dto.admin.request.AdminCreateUserRequest;
import com.soundbook.dto.admin.request.AdminUpdateUserRequest;
import com.soundbook.dto.admin.response.AdminUserDetailResponse;
import com.soundbook.dto.admin.response.AdminUserResponse;
import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.entity.User;
import com.soundbook.entity.UserOnboarding;
import com.soundbook.entity.UserProfile;
import com.soundbook.entity.enums.UserStatus;
import com.soundbook.exception.ResourceNotFoundException;
import com.soundbook.repository.UserRepository;
import com.soundbook.service.admin.AdminUserService;
import com.soundbook.utils.PageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResponse<AdminUserResponse> getAllUsers(String keyword, int page, int size)
    {
        int pageNumber = page > 0 ? page - 1 : 0;
        Pageable pageable = PageRequest.of(pageNumber, size, Sort.by("createdAt").descending());
        Page<User> userPage = userRepository.searchUsers(keyword, pageable);

        List<AdminUserResponse> users = userPage.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return PageMapper.toPageResponse(userPage, users);
    }

    @Override
    public AdminUserDetailResponse getDetailUser(Long id)
    {
        User user = userRepository.findUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        UserProfile profile = user.getProfile();
        UserOnboarding onboarding = user.getOnboarding();

        return AdminUserDetailResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .googleSub(user.getGoogleSub())
                .displayName(user.getDisplayName())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .username(profile != null ? profile.getUsername() : "")
                .avatarUrl(profile != null ? profile.getAvatarUrl() : "")
                .coverUrl(profile != null ? profile.getCoverUrl() : "")
                .bio(profile != null ? profile.getBio() : "")
                .pinnedTrackId(profile != null ? profile.getPinnedTrackId() : "")
                .musicConnected(onboarding != null && onboarding.getMusicConnected())
                .tasteDnaReady(onboarding != null && onboarding.getTasteDnaReady())
                .build();
    }

    @Override
    @Transactional
    public void createUser(AdminCreateUserRequest request)
    {
        if (userRepository.existsByEmail(request.getEmail()))
        {
            throw new RuntimeException("Email này đã được sử dụng trong hệ thống!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName());
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setUsername("user_" + System.currentTimeMillis());
        user.setProfile(profile);

        UserOnboarding onboarding = new UserOnboarding();
        onboarding.setUser(user);
        onboarding.setMusicConnected(false);
        onboarding.setMusicDnaReady(false);
        onboarding.setBookDnaReady(false);
        onboarding.setTasteDnaReady(false);
        user.setOnboarding(onboarding);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUser(Long id, AdminUpdateUserRequest request)
    {
        User user = userRepository.findUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        if (request.getRole() != null)
        {
            user.setRole(request.getRole());
        }

        if (request.getStatus() != null)
        {
            user.setStatus(request.getStatus());
        }

        if (request.getDisplayName() != null && !request.getDisplayName().trim().isEmpty())
        {
            user.setDisplayName(request.getDisplayName().trim());
        }

        UserProfile profile = user.getProfile();
        if (profile != null)
        {
            if (request.isRemoveAvatar())
            {
                profile.setAvatarUrl(null);
            }
            if (request.isRemoveCover())
            {
                profile.setCoverUrl(null);
            }
            if (request.isRemoveBio())
            {
                profile.setBio(null);
            }
        }

        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id)
    {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));

        user.setStatus(UserStatus.DELETED);
        userRepository.save(user);
    }

    private AdminUserResponse mapToDTO(User user)
    {
        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName((user.getDisplayName()))
                .googleSub(user.getGoogleSub())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
