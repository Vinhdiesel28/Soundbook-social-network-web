package com.soundbook.controller;

import com.soundbook.dto.admin.request.AdminCreateUserRequest;
import com.soundbook.dto.admin.request.AdminUpdateUserRequest;
import com.soundbook.dto.admin.response.AdminUserDetailResponse;
import com.soundbook.dto.admin.response.AdminUserResponse;
import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.service.admin.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController
{
    private final AdminUserService adminUserService;

    @GetMapping()
    public ResponseEntity<PageResponse<AdminUserResponse>> getAllUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    )
    {
        return ResponseEntity.ok(adminUserService.getAllUsers(keyword, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserDetailResponse> getDetailUser(@PathVariable Long id)
    {
        return ResponseEntity.ok(adminUserService.getDetailUser(id));
    }

    @PostMapping
    public ResponseEntity<Void> createUser(@Valid @RequestBody AdminCreateUserRequest request)
    {
        adminUserService.createUser(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(
            @PathVariable Long id,
            @RequestBody AdminUpdateUserRequest request)
    {
        adminUserService.updateUser(id, request);
        return ResponseEntity.ok("Cập nhật thông tin người dùng thành công!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id)
    {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
