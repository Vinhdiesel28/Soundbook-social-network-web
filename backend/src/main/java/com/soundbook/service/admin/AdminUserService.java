package com.soundbook.service.admin;

import com.soundbook.dto.admin.request.AdminCreateUserRequest;
import com.soundbook.dto.admin.request.AdminUpdateUserRequest;
import com.soundbook.dto.admin.response.AdminUserDetailResponse;
import com.soundbook.dto.admin.response.AdminUserResponse;
import com.soundbook.dto.common.response.PageResponse;

public interface AdminUserService
{
    PageResponse<AdminUserResponse> getAllUsers(String keyword, int page, int size);

    AdminUserDetailResponse getDetailUser(Long id);

    void createUser(AdminCreateUserRequest request);

    void updateUser(Long id, AdminUpdateUserRequest request);

    void deleteUser(Long id);
}
