package com.soundbook.repository;

import com.soundbook.entity.RoomQueueItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomQueueRepository extends JpaRepository<RoomQueueItem, Long> {
}
