package com.soundbook.repository;

import com.soundbook.entity.FriendRequest;
import com.soundbook.entity.enums.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    Optional<FriendRequest> findFirstByRequester_IdAndReceiver_IdOrderByCreatedAtDesc(Long requesterId, Long receiverId);

    Optional<FriendRequest> findFirstByRequester_IdAndReceiver_IdAndStatus(Long requesterId, Long receiverId, FriendRequestStatus status);

    List<FriendRequest> findByReceiver_IdAndStatusOrderByCreatedAtDesc(Long receiverId, FriendRequestStatus status);

    List<FriendRequest> findByRequester_IdAndStatusOrderByCreatedAtDesc(Long requesterId, FriendRequestStatus status);
}
