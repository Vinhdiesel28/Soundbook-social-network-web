package com.soundbook.service.admin.impl;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.admin.response.AdminReportDetailResponse;
import com.soundbook.dto.admin.response.AdminReportResponse;
import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.entity.Report;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.repository.CommentRepository;
import com.soundbook.repository.DmMessageRepository;
import com.soundbook.repository.ReportRepository;
import com.soundbook.repository.UserRepository;
import com.soundbook.service.admin.AdminReportService;
import com.soundbook.utils.PageMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminReportServiceImpl implements AdminReportService
{
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final DmMessageRepository dmMessageRepository;

    @Override
    public PageResponse<AdminReportResponse> getAllReports(String keyword, ReportStatus status, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        Page<Report> reportPage = reportRepository.searchReports(keyword, status, pageable);

        return PageMapper.toPageResponse(reportPage.map(this::mapToResponse));
    }

    @Override
    public AdminReportDetailResponse getReportDetail(Long id)
    {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_FOUND));

        return AdminReportDetailResponse.builder()
                .info(mapToResponse(report))
                .description(report.getDescription())
                .reviewedByName(report.getReviewedBy() != null ? report.getReviewedBy().getDisplayName() : null)
                .reviewedAt(report.getReviewedAt())
                .build();
    }

    @Override
    @Transactional
    public void reviewReport(Long id, Long adminId)
    {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.REPORT_NOT_FOUND));

        report.setStatus(ReportStatus.REVIEWED);
        report.setReviewedBy(userRepository.getReferenceById(adminId));
        report.setReviewedAt(LocalDateTime.now());

        reportRepository.save(report);
    }

    @Override
    @Transactional
    public void rejectReport(Long id)
    {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));

        report.setStatus(ReportStatus.REJECTED);
        reportRepository.save(report);
    }

    @Override
    @Transactional
    public void resolveReport(Long id)
    {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION));

        report.setStatus(ReportStatus.RESOLVED);
        reportRepository.save(report);
    }

    private AdminReportResponse mapToResponse(Report report)
    {
        Long parentId = null;
        String summary = switch (report.getTargetType())
        {
            case POST -> "Bài viết #" + report.getTargetId();
            case COMMENT -> {
                parentId = commentRepository.findById(report.getTargetId())
                        .map(c -> c.getPost().getId())
                        .orElse(null);
                yield "Bình luận #" + report.getTargetId();
            }
            case USER -> userRepository.findById(report.getTargetId())
                    .map(u -> "@" + u.getDisplayName())
                    .orElse("Tài khoản đã xóa");
            case ROOM -> "Phòng #" + report.getTargetId();
            case DM_MESSAGE -> {
                parentId = dmMessageRepository.findById(report.getTargetId())
                        .map(m -> m.getThread().getId())
                        .orElse(null);
                yield "Tin nhắn DM #" + report.getTargetId();
            }
            case OTHER -> "Khác";
        };

        return AdminReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reporterName(report.getReporter().getDisplayName())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .targetParentId(parentId)
                .targetSummary(summary)
                .reason(report.getReason())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
