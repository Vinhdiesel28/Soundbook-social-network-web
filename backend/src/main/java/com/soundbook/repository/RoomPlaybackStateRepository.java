package com.soundbook.repository;

import com.soundbook.entity.RoomPlaybackState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomPlaybackStateRepository extends JpaRepository<RoomPlaybackState, Long> {
}
