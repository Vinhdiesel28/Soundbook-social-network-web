package com.soundbook.repository;

import com.soundbook.entity.DmThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query(value = "SELECT t FROM DmThread t JOIN FETCH t.user1 u1 JOIN FETCH t.user2 u2 " +
            "WHERE :keyword IS NULL OR :keyword = '' " +
            "OR LOWER(u1.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u1.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u2.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u2.email) LIKE LOWER(CONCAT('%', :keyword, '%'))",
            countQuery = "SELECT COUNT(t) FROM DmThread t JOIN t.user1 u1 JOIN t.user2 u2 " +
                    "WHERE :keyword IS NULL OR :keyword = '' " +
                    "OR LOWER(u1.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(u1.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(u2.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(u2.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<DmThread> searchThreadsWithUsers(@Param("keyword") String keyword, Pageable pageable);
}
