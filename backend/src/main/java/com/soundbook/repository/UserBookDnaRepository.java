package com.soundbook.repository;

import com.soundbook.entity.UserBookDna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBookDnaRepository extends JpaRepository<UserBookDna, Long> {
}
