package com.soundbook.repository;

import com.soundbook.entity.DmMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DmMessageRepository extends JpaRepository<DmMessage, Long>
{
    @Query(value = "SELECT m FROM DmMessage m JOIN FETCH m.sender WHERE m.thread.id = :threadId",
            countQuery = "SELECT COUNT(m) FROM DmMessage m WHERE m.thread.id = :threadId")
    Page<DmMessage> findByThreadId(@Param("threadId") Long threadId, Pageable pageable);
}
