package com.soundbook.service.admin.impl;

import com.soundbook.dto.response.DashboardStatsResponse;
import com.soundbook.dto.response.TrendingPostResponse;
import com.soundbook.entity.Post;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.entity.enums.RoomStatus;
import com.soundbook.entity.enums.TargetType;
import com.soundbook.repository.*;
import com.soundbook.service.admin.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService
{
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;

    @Override
    public DashboardStatsResponse getStats()
    {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        LocalDateTime sixtyDaysAgo = now.minusDays(60);

        // User Stats
        long totalUsers = userRepository.count();
        long usersThisMonth = userRepository.countByCreatedAtBetween(thirtyDaysAgo, now);
        long usersLastMonth = userRepository.countByCreatedAtBetween(sixtyDaysAgo, thirtyDaysAgo);

        // Post
        long totalPosts = postRepository.count();
        long postsThisMonth = postRepository.countByCreatedAtBetween(thirtyDaysAgo, now);
        long postsLastMonth = postRepository.countByCreatedAtBetween(sixtyDaysAgo, thirtyDaysAgo);

        // Report
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);
        long reportsThisMonth = reportRepository.countByCreatedAtBetween(thirtyDaysAgo, now);
        long reportsLastMonth = reportRepository.countByCreatedAtBetween(sixtyDaysAgo, thirtyDaysAgo);

        long activeLiveRooms = roomRepository.countByStatus(RoomStatus.LIVE);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .userGrowth(calculateGrowth(usersThisMonth, usersLastMonth))

                .activeLiveRooms(activeLiveRooms) // Không có growth

                .totalPosts(totalPosts)
                .postGrowth(calculateGrowth(postsThisMonth, postsLastMonth))

                .pendingReports(pendingReports)
                .reportGrowth(calculateGrowth(reportsThisMonth, reportsLastMonth))

                .build();
    }

    @Override
    public List<TrendingPostResponse> getTrendingPosts(int limit)
    {
        List<Post> topPosts = postRepository.findTrendingPosts(PageRequest.of(0, limit));

        return topPosts.stream().map(post -> {
            long actualCommentCount = commentRepository.countByPostId(post.getId());
            long actualLikeCount = reactionRepository.countByTargetIdAndTargetType(post.getId(), TargetType.POST);

            String type = post.getType().name();

            return TrendingPostResponse.builder()
                    .id(post.getId())
                    .authorName(post.getUser().getDisplayName())
                    .authorAvatar(post.getUser().getProfile() != null ? post.getUser().getProfile().getAvatarUrl() : null)
                    .caption(post.getCaption())
                    .postType(type)
                    .likeCount(actualLikeCount)
                    .commentCount(actualCommentCount)
                    .build();
        }).collect(Collectors.toList());
    }


    private double calculateGrowth(long currentCount, long previousCount)
    {
        if (previousCount == 0) {
            return currentCount > 0 ? 100.0 : 0.0;
        }
        double growth = ((double) (currentCount - previousCount) / previousCount) * 100.0;
        return Math.round(growth * 10.0) / 10.0;
    }
}
