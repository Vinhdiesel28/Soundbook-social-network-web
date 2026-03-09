package com.soundbook.repository;

import com.soundbook.entity.UserBookshelfItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBookshelfItemRepository extends JpaRepository<UserBookshelfItem, Long> {
}
