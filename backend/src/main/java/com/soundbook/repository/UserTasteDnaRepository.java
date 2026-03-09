package com.soundbook.repository;

import com.soundbook.entity.UserTasteDna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTasteDnaRepository extends JpaRepository<UserTasteDna, Long> {
}
