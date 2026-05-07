package com.soundbook.dto.response;

import lombok.Builder;
import lombok.Data;
import org.slf4j.Logger;

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
