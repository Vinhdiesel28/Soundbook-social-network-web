package com.soundbook.repository;

import com.soundbook.entity.UserMusicCollection;
import com.soundbook.entity.enums.CollectionItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMusicCollectionRepository extends JpaRepository<UserMusicCollection, Long> {

    boolean existsByUser_IdAndItemTypeAndItemId(Long userId, CollectionItemType itemType, String itemId);
}
