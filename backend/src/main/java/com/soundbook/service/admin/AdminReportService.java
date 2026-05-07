package com.soundbook.service.admin;

import com.soundbook.dto.response.AdminReportDetailResponse;
import com.soundbook.dto.response.AdminReportResponse;
import com.soundbook.dto.response.PageResponse;
import com.soundbook.entity.enums.ReportStatus;

public interface AdminReportService
{
    PageResponse<AdminReportResponse> getAllReports(String keyword, ReportStatus status, int page, int size);

    AdminReportDetailResponse getReportDetail(Long id);

    void reviewReport(Long id, Long adminId);

    void rejectReport(Long id);

    void resolveReport(Long id);
}
