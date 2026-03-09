package com.soundbook.repository;

import com.soundbook.entity.Friendship;
import com.soundbook.entity.FriendshipId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, FriendshipId> {
}
