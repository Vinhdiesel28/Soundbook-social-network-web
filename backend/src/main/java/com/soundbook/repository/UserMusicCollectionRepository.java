package com.soundbook.repository;

import com.soundbook.entity.UserMusicCollection;
import com.soundbook.entity.enums.CollectionItemType;
import com.soundbook.entity.enums.Visibility;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface UserMusicCollectionRepository extends JpaRepository<UserMusicCollection, Long> {
    boolean existsByUser_IdAndItemTypeAndItemId(Long userId, CollectionItemType itemType, String itemId);

    List<UserMusicCollection> findByUser_IdAndVisibilityInOrderBySortOrderAscCreatedAtDesc(Long userId, Collection<Visibility> visibility);

    @Query("""
            select m
            from UserMusicCollection m
            where m.visibility = :visibility
              and (
                lower(m.title) like lower(concat('%', :keyword, '%'))
                or lower(coalesce(m.subtitle, '')) like lower(concat('%', :keyword, '%'))
              )
            order by m.createdAt desc
            """)
    List<UserMusicCollection> searchPublicMusic(@Param("keyword") String keyword, @Param("visibility") Visibility visibility, Pageable pageable);
}
