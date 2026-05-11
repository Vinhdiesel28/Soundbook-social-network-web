package com.soundbook.dto.admin.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminReportDetailResponse
{
    private AdminReportResponse info;

    private String description;
    private String reviewedByName;
    private LocalDateTime reviewedAt;
}
