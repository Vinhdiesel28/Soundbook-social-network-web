package com.soundbook.repository;

import com.soundbook.entity.Follow;
import com.soundbook.entity.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    List<Follow> findByIdFollowerId(Long followerId);

    boolean existsByIdFollowerIdAndIdFolloweeId(Long followerId, Long followeeId);

    long countByIdFollowerId(Long followerId);

    long countByIdFolloweeId(Long followeeId);
}
