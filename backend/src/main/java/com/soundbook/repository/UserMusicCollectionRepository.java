package com.soundbook.repository;

import com.soundbook.entity.UserMusicCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMusicCollectionRepository extends JpaRepository<UserMusicCollection, Long> {
}
