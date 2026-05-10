package com.soundbook.repository;

import com.soundbook.entity.RoomQueueItem;
import com.soundbook.entity.RoomMessage;
import com.soundbook.entity.RoomQueueItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query(value = "SELECT q FROM RoomQueueItem q JOIN FETCH q.addedBy " +
            "WHERE q.room.id = :roomId AND q.playedAt IS NULL",
            countQuery = "SELECT COUNT(q) FROM RoomQueueItem q WHERE q.room.id = :roomId AND q.playedAt IS NULL")
    Page<RoomQueueItem> findByRoomIdAndPlayedAtIsNull(@Param("roomId") Long roomId, Pageable pageable);
}
