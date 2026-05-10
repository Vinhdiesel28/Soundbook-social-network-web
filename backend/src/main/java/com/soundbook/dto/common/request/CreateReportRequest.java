package com.soundbook.dto.common.request;

import com.soundbook.entity.enums.ReportReason;
import com.soundbook.entity.enums.ReportTargetType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateReportRequest
{
    @NotNull(message = "Loại đối tượng không được để trống")
    private ReportTargetType targetType;

    @NotNull(message = "ID đối tượng không được để trống")
    private Long targetId;

    @NotNull(message = "Lý do báo cáo không được để trống")
    private ReportReason reason;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;
}