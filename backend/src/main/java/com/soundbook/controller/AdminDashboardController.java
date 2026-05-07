package com.soundbook.controller;

import com.soundbook.dto.response.ApiResponse;
import com.soundbook.dto.response.DashboardStatsResponse;
import com.soundbook.dto.response.TrendingPostResponse;
import com.soundbook.service.admin.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats()
    {
        return ResponseEntity.ok(ApiResponse.<DashboardStatsResponse>builder()
                .message("Lấy thống kê thành công")
                .data(dashboardService.getStats())
                .build());
    }

    @GetMapping("/trending-posts")
    public ResponseEntity<ApiResponse<List<TrendingPostResponse>>> getTrendingPosts(
            @RequestParam(defaultValue = "4") int limit)
    {
        return ResponseEntity.ok(ApiResponse.<List<TrendingPostResponse>>builder()
                .message("Lấy bài viết thịnh hành thành công")
                .data(dashboardService.getTrendingPosts(limit))
                .build());
    }
}