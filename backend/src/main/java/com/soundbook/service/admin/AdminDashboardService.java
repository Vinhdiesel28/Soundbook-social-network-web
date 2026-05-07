package com.soundbook.service.admin;

import com.soundbook.dto.response.DashboardStatsResponse;
import com.soundbook.dto.response.TrendingPostResponse;

import java.util.List;

public interface AdminDashboardService
{
    DashboardStatsResponse getStats();

    List<TrendingPostResponse> getTrendingPosts(int limit);
}
