package com.soundbook.dto.response;

import com.soundbook.entity.enums.ReportReason;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.entity.enums.ReportTargetType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminReportResponse
{
    private Long id;
    private Long reporterId;
    private String reporterName;
    private ReportTargetType targetType;
    private Long targetId;

    private String targetSummary;

    private ReportReason reason;
    private ReportStatus status;
    private LocalDateTime createdAt;
}