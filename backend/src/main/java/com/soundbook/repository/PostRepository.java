package com.soundbook.repository;

import com.soundbook.entity.Post;
import com.soundbook.entity.enums.Visibility;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByVisibilityOrderByCreatedAtDesc(Visibility visibility, Pageable pageable);

    List<Post> findByUser_IdInAndVisibilityInOrderByCreatedAtDesc(
            Collection<Long> userIds,
            Collection<Visibility> visibilities,
            Pageable pageable
    );

    List<Post> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByUser_Id(Long userId);

    @Query("""
            select p
            from Post p
            where p.visibility = :visibility
              and (
                lower(coalesce(p.caption, '')) like lower(concat('%', :keyword, '%'))
                or lower(coalesce(p.contentRich, '')) like lower(concat('%', :keyword, '%'))
                or lower(coalesce(p.refJson, '')) like lower(concat('%', :keyword, '%'))
                or lower(coalesce(p.moodTag, '')) like lower(concat('%', :keyword, '%'))
              )
            order by p.createdAt desc
            """)
    List<Post> searchPublicPosts(@Param("keyword") String keyword, @Param("visibility") Visibility visibility, Pageable pageable);
}
