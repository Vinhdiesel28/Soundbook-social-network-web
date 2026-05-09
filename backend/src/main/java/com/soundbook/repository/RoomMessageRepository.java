package com.soundbook.repository;

import com.soundbook.entity.RoomMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomMessageRepository extends JpaRepository<RoomMessage, Long> {
}
