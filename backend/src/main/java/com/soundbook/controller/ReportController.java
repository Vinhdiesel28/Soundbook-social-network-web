package com.soundbook.controller;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.common.request.CreateReportRequest;
import com.soundbook.dto.common.response.ApiResponse;
import com.soundbook.entity.User;
import com.soundbook.repository.UserRepository;
import com.soundbook.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController
{
    private final ReportService reportService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createReport(
            @Valid @RequestBody CreateReportRequest request)
    {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        reportService.createReport(currentUser, request);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Cảm ơn bạn đã báo cáo. Đội ngũ admin sẽ xem xét trong thời gian sớm nhất.")
                .build());
    }
}
