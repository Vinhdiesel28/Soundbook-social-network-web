package com.soundbook.repository;

import com.soundbook.entity.RoomQueueItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomQueueRepository extends JpaRepository<RoomQueueItem, Long> {
    List<RoomQueueItem> findByRoom_IdOrderByPlayedAtDescPositionOrderAsc(Long roomId);

    @Query("SELECT MAX(rq.positionOrder) FROM RoomQueueItem rq WHERE rq.room.id = :roomId")
    Optional<Integer> findMaxPositionOrderByRoomId(@Param("roomId") Long roomId);
}
