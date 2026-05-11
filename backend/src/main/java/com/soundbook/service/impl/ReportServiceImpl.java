package com.soundbook.service.impl;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.common.request.CreateReportRequest;
import com.soundbook.entity.Report;
import com.soundbook.entity.User;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.repository.ReportRepository;
import com.soundbook.service.ReportService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService
{
    private final ReportRepository reportRepository;

    @Transactional
    public void createReport(User currentUser, CreateReportRequest request) {

        boolean alreadyReported = reportRepository.existsByReporterIdAndTargetTypeAndTargetId(
                currentUser.getId(),
                request.getTargetType(),
                request.getTargetId()
        );

        if (alreadyReported)
        {
            throw new AppException(ErrorCode.ALREADY_REPORTED);
        }

        Report report = Report.builder()
                .reporter(currentUser)
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .description(request.getDescription())
                .status(ReportStatus.PENDING)
                .build();

        reportRepository.save(report);
    }
}
