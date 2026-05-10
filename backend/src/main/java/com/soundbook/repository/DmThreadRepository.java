package com.soundbook.repository;

import com.soundbook.entity.DmThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DmThreadRepository extends JpaRepository<DmThread, Long> {

		Optional<DmThread> findByUser1_IdAndUser2_Id(Long user1Id, Long user2Id);

		@Query("""
						select t
						from DmThread t
						where (t.user1.id = :userId or t.user2.id = :userId)
							and (
								:updatedAt is null
								or t.updatedAt < :updatedAt
								or (t.updatedAt = :updatedAt and t.id < :cursorId)
							)
						order by t.updatedAt desc, t.id desc
						""")
		List<DmThread> findThreadsByUserWithCursor(
						@Param("userId") Long userId,
						@Param("updatedAt") LocalDateTime updatedAt,
						@Param("cursorId") Long cursorId,
						Pageable pageable
		);
}
