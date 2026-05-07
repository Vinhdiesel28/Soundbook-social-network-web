package com.soundbook.repository;

import com.soundbook.entity.Post;
import com.soundbook.entity.Reaction;
import com.soundbook.entity.enums.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>
{
    @Query(value = "SELECT p FROM Post p JOIN FETCH p.user u " +
            "WHERE :keyword IS NULL OR :keyword = '' " +
            "OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))",
            countQuery = "SELECT COUNT(p) FROM Post p JOIN p.user u " +
                    "WHERE :keyword IS NULL OR :keyword = '' " +
                    "OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Post> searchAllWithAuthor(@Param("keyword") String keyword, Pageable pageable);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT p FROM Post p JOIN FETCH p.user u LEFT JOIN FETCH u.profile " +
            "ORDER BY (SELECT COUNT(c) FROM Comment c WHERE c.post.id = p.id) DESC")
    List<Post> findTrendingPosts(Pageable pageable);
}
