package com.soundbook.repository;

import com.soundbook.entity.Follow;
import com.soundbook.entity.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {
}
