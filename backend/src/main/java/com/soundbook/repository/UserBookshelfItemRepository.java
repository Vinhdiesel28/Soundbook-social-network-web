package com.soundbook.repository;

import com.soundbook.entity.UserBookshelfItem;
import com.soundbook.entity.enums.Visibility;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserBookshelfItemRepository extends JpaRepository<UserBookshelfItem, Long> {
    List<UserBookshelfItem> findByUser_IdOrderByUpdatedAtDesc(Long userId);

    List<UserBookshelfItem> findByUser_IdAndVisibilityInOrderByUpdatedAtDesc(Long userId, List<Visibility> visibilities);

    @Query("""
            select b
            from UserBookshelfItem b
            where lower(b.bookPayloadJson) like lower(concat('%', :keyword, '%'))
               or lower(b.bookKey) like lower(concat('%', :keyword, '%'))
            order by b.updatedAt desc
            """)
    List<UserBookshelfItem> searchBooks(@Param("keyword") String keyword, Pageable pageable);
}
