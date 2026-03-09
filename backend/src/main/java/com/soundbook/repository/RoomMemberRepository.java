package com.soundbook.repository;

import com.soundbook.entity.RoomMember;
import com.soundbook.entity.RoomMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, RoomMemberId> {
}
