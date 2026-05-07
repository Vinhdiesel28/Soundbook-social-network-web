package com.soundbook.repository;

import com.soundbook.entity.Room;
import com.soundbook.entity.enums.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long>
{
    @Query("SELECT r FROM Room r JOIN FETCH r.host h " +
            "WHERE (:keyword IS NULL OR :keyword = '' " +
            "OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(h.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Room> searchRooms(@Param("keyword") String keyword, Pageable pageable);

    long countByStatus(RoomStatus status);
}
