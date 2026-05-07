package com.soundbook.controller;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.response.AdminReportDetailResponse;
import com.soundbook.dto.response.AdminReportResponse;
import com.soundbook.dto.response.ApiResponse;
import com.soundbook.dto.response.PageResponse;
import com.soundbook.entity.User;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.repository.UserRepository;
import com.soundbook.service.admin.AdminReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
public class AdminReportController {

    private final AdminReportService adminReportService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AdminReportResponse>>> getAllReports(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size)
    {
        var data = adminReportService.getAllReports(keyword, status, page, size);
        return ResponseEntity.ok(ApiResponse.<PageResponse<AdminReportResponse>>builder()
                .message("Lấy danh sách báo cáo thành công")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminReportDetailResponse>> getReportDetail(@PathVariable Long id)
    {
        var data = adminReportService.getReportDetail(id);
        return ResponseEntity.ok(ApiResponse.<AdminReportDetailResponse>builder()
                .message("Lấy chi tiết báo cáo thành công")
                .data(data)
                .build());
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<Void>> reviewReport(@PathVariable Long id)
    {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Long currentAdminId = currentUser.getId();

        adminReportService.reviewReport(id, currentAdminId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đã chuyển trạng thái sang Đang xem xét")
                .build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectReport(@PathVariable Long id)
    {
        adminReportService.rejectReport(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đã bác bỏ báo cáo")
                .build());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<Void>> resolveReport(@PathVariable Long id)
    {
        adminReportService.resolveReport(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .message("Đã giải quyết báo cáo")
                .build());
    }
}