package com.soundbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_onboarding")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserOnboarding {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "music_connected", nullable = false)
    @Builder.Default
    private Boolean musicConnected = false;

    @Column(name = "music_dna_ready", nullable = false)
    @Builder.Default
    private Boolean musicDnaReady = false;

    @Column(name = "book_dna_ready", nullable = false)
    @Builder.Default
    private Boolean bookDnaReady = false;

    @Column(name = "taste_dna_ready", nullable = false)
    @Builder.Default
    private Boolean tasteDnaReady = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
