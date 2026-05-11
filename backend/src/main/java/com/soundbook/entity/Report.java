package com.soundbook.entity;

import com.soundbook.entity.enums.ReportReason;
import com.soundbook.entity.enums.ReportStatus;
import com.soundbook.entity.enums.ReportTargetType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports", uniqueConstraints = {
        @UniqueConstraint(name = "uq_report_once", columnNames = {"reporter_id", "target_type", "target_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false, columnDefinition = "VARCHAR(50)")
    private ReportTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false, columnDefinition = "VARCHAR(50)")
    private ReportReason reason;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(50)")
    @Builder.Default
    private ReportStatus status = ReportStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}