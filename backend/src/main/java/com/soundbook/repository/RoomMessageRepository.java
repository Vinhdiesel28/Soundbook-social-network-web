package com.soundbook.repository;

import com.soundbook.entity.RoomMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomMessageRepository extends JpaRepository<RoomMessage, Long> {
    @Query(value = "SELECT m FROM RoomMessage m JOIN FETCH m.sender s LEFT JOIN FETCH s.profile " +
            "WHERE m.room.id = :roomId",
            countQuery = "SELECT COUNT(m) FROM RoomMessage m WHERE m.room.id = :roomId")
    Page<RoomMessage> findByRoomId(@Param("roomId") Long roomId, Pageable pageable);
}