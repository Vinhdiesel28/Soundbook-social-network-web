package com.soundbook.repository;

import com.soundbook.entity.RoomMember;
import com.soundbook.entity.RoomMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, RoomMemberId> {
	Optional<RoomMember> findById(RoomMemberId id);

	List<RoomMember> findByRoom_IdAndLeftAtIsNull(Long roomId);

	long countByRoom_IdAndLeftAtIsNull(Long roomId);
}
