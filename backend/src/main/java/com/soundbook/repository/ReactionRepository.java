package com.soundbook.repository;

import com.soundbook.entity.Reaction;
import com.soundbook.entity.enums.ReactionType;
import com.soundbook.entity.enums.TargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    long countByTargetTypeAndTargetId(TargetType targetType, Long targetId);

    long countByTargetTypeAndTargetIdAndReactionType(TargetType targetType, Long targetId, ReactionType reactionType);

    Optional<Reaction> findByUser_IdAndTargetTypeAndTargetId(Long userId, TargetType targetType, Long targetId);

    void deleteByTargetTypeAndTargetId(TargetType targetType, Long targetId);
}
