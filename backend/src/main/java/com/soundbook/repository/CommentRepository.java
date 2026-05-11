package com.soundbook.repository;

import com.soundbook.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
//    long countByPostId(Long postId);
//
//    List<Comment> findByPostIdAndParentIsNullOrderByCreatedAtDesc(Long postId, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId AND c.status <> com.soundbook.entity.enums.CommentStatus.DELETED")
    long countByPostId(@Param("postId") Long postId);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parent IS NULL AND c.status <> com.soundbook.entity.enums.CommentStatus.DELETED ORDER BY c.createdAt DESC")
    List<Comment> findByPostIdAndParentIsNullOrderByCreatedAtDesc(@Param("postId") Long postId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parent IS NULL AND c.status <> com.soundbook.entity.enums.CommentStatus.DELETED ORDER BY c.createdAt DESC")
    List<Comment> findByPostIdAndParentIsNullOrderByCreatedAtDesc(@Param("postId") Long postId);

    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.status <> com.soundbook.entity.enums.CommentStatus.DELETED ORDER BY c.createdAt DESC")
    List<Comment> findByPostIdAndStatusNotDeletedOrderByCreatedAtDesc(@Param("postId") Long postId, Pageable pageable);

    void deleteByPostId(Long postId);

    Page<Comment> findByPostId(Long postId, Pageable pageable);
}
