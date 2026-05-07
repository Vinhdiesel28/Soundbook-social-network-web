package com.soundbook.repository;

import com.soundbook.entity.DmThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DmThreadRepository extends JpaRepository<DmThread, Long>
{
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
