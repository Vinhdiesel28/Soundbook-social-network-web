package com.soundbook.repository;

import com.soundbook.entity.Reaction;
import com.soundbook.entity.enums.ReactionType;
import com.soundbook.entity.enums.TargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long>
{
    @Query(value = "SELECT r FROM Reaction r JOIN FETCH r.user u LEFT JOIN FETCH u.profile " +
            "WHERE r.targetId = :targetId AND r.targetType = :targetType " +
            "AND (:type IS NULL OR r.reactionType = :type)",
            countQuery = "SELECT COUNT(r) FROM Reaction r " +
                    "WHERE r.targetId = :targetId AND r.targetType = :targetType " +
                    "AND (:type IS NULL OR r.reactionType = :type)")
    Page<Reaction> findByTarget(@Param("targetId") Long targetId,
                                @Param("targetType") TargetType targetType,
                                @Param("type") ReactionType type,
                                Pageable pageable);

    long countByTargetIdAndTargetType(Long targetId, TargetType targetType);
}
