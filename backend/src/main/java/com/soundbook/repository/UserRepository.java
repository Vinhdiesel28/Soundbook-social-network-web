package com.soundbook.repository;

import com.soundbook.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByGoogleSub(String googleSub);

    @Query("SELECT u FROM User u WHERE " +
            ":keyword IS NULL OR :keyword = '' " +
            "OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT u FROM User u " +
            "LEFT JOIN FETCH u.profile " +
            "LEFT JOIN FETCH u.onboarding " +
            "WHERE u.id = :id")
    Optional<User> findUserById(@Param("id") Long id);
}