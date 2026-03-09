package com.soundbook.repository;

import com.soundbook.entity.UserMusicDna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMusicDnaRepository extends JpaRepository<UserMusicDna, Long> {
}
