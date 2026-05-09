package com.soundbook.repository;

import com.soundbook.entity.Friendship;
import com.soundbook.entity.FriendshipId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, FriendshipId> {
    boolean existsByIdUserIdAndIdFriendId(Long userId, Long friendId);

    List<Friendship> findByIdUserIdOrderByCreatedAtDesc(Long userId);

    long countByIdUserId(Long userId);
}
