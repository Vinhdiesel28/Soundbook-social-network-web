package com.soundbook.repository;

import com.soundbook.entity.PostMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostMediaRepository extends JpaRepository<PostMedia, Long> {
    Optional<PostMedia> findFirstByPost_IdOrderByIdAsc(Long postId);

    void deleteByPost_Id(Long postId);
}
