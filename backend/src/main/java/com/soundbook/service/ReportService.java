package com.soundbook.service;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.common.request.CreateReportRequest;
import com.soundbook.entity.Report;
import com.soundbook.entity.User;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.repository.ReactionRepository;
import com.soundbook.repository.ReportRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

public interface ReportService
{
   void createReport(User currentUser, CreateReportRequest request);
}
