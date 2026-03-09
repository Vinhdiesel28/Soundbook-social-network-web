package com.soundbook.repository;

import com.soundbook.entity.DmThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DmThreadRepository extends JpaRepository<DmThread, Long> {
}
