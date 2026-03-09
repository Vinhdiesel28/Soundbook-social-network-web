package com.soundbook.repository;

import com.soundbook.entity.DmMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DmMessageRepository extends JpaRepository<DmMessage, Long> {
}
