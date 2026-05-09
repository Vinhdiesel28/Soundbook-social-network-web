package com.soundbook.repository;

import com.soundbook.entity.Room;
import com.soundbook.entity.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
	List<Room> findByStatusOrderByCreatedAtDesc(RoomStatus status, Pageable pageable);
}
