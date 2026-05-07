package com.soundbook.repository;

import com.soundbook.entity.Report;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.entity.enums.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long>
{
    @Query(value = "SELECT r FROM Report r JOIN FETCH r.reporter u " +
            "WHERE (:status IS NULL OR r.status = :status) " +
            "AND (:keyword IS NULL OR :keyword = '' " +
            "OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')))",
            countQuery = "SELECT COUNT(r) FROM Report r JOIN r.reporter u " +
                    "WHERE (:status IS NULL OR r.status = :status) " +
                    "AND (:keyword IS NULL OR :keyword = '' " +
                    "OR LOWER(u.displayName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                    "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Report> searchReports(@Param("keyword") String keyword,
                               @Param("status") ReportStatus status,
                               Pageable pageable);

    long countByStatus(ReportStatus status);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}