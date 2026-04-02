package com.soundbook.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @Pattern(regexp = "USER|ADMIN", flags = Pattern.Flag.CASE_INSENSITIVE, message = "INVALID_REQUEST")
    private String loginType = "USER";
}