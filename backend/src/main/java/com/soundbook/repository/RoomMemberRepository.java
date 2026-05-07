package com.soundbook.repository;

import com.soundbook.entity.RoomMember;
import com.soundbook.entity.RoomMemberId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, RoomMemberId>
{
    Page<RoomMember> findByRoomId(Long roomId, Pageable pageable);

    @Modifying
    @Query("UPDATE RoomMember m SET m.leftAt = :now WHERE m.room.id = :roomId AND m.leftAt IS NULL")
    void updateLeaveTimeForAllMembers(@Param("roomId") Long roomId, @Param("now") LocalDateTime now);
}
