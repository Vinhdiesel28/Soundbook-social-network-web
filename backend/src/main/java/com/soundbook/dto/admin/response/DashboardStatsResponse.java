package com.soundbook.dto.admin.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse
{
    private long totalUsers;
    private double userGrowth;

    private long activeLiveRooms;

    private long totalPosts;
    private double postGrowth;

    private long pendingReports;
    private double reportGrowth;
}
