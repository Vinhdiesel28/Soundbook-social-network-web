package com.soundbook.dto.admin.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateProfileRequest
{
    @NotBlank(message = "Tên hiển thị không được để trống")
    @Size(min = 2, max = 100, message = "Tên hiển thị phải từ 2 đến 100 ký tự")
    private String displayName;
}