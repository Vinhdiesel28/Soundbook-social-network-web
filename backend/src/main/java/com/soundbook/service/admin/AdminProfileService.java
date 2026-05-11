package com.soundbook.service.admin;

import com.soundbook.dto.admin.request.AdminUpdateProfileRequest;
import com.soundbook.dto.common.request.ChangePasswordRequest;
import com.soundbook.dto.admin.response.AdminProfileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface AdminProfileService
{
    AdminProfileResponse getMyProfile(String email);

    void updateProfile(String email, AdminUpdateProfileRequest request);

    String updateAvatar(String email, MultipartFile file) throws IOException;

    void changePassword(String email, ChangePasswordRequest request);
}
