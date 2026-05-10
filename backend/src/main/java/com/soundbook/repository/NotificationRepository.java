package com.soundbook.repository;

import com.soundbook.entity.Notification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

		long countByUser_IdAndIsReadFalse(Long userId);

		@Query("""
						select n
						from Notification n
						where n.user.id = :userId
							and (
								:cursorCreatedAt is null
								or n.createdAt < :cursorCreatedAt
								or (n.createdAt = :cursorCreatedAt and n.id < :cursorId)
							)
						order by n.createdAt desc, n.id desc
						""")
		List<Notification> findNotificationsWithCursor(
						@Param("userId") Long userId,
						@Param("cursorCreatedAt") LocalDateTime cursorCreatedAt,
						@Param("cursorId") Long cursorId,
						Pageable pageable
		);
}
