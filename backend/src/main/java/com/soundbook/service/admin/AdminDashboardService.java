package com.soundbook.service.admin;

import com.soundbook.dto.admin.response.DashboardStatsResponse;
import com.soundbook.dto.admin.response.TrendingPostResponse;

import java.util.List;

public interface AdminDashboardService
{
    DashboardStatsResponse getStats();

    List<TrendingPostResponse> getTrendingPosts(int limit);
}
