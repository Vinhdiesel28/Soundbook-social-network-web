package com.soundbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_queue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomQueueItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "track_id", nullable = false, length = 64)
    private String trackId;

    @Column(name = "track_payload_json", nullable = false, columnDefinition = "JSON")
    private String trackPayloadJson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_id", nullable = false)
    private User addedBy;

    @Column(name = "vote_count", nullable = false)
    @Builder.Default
    private Integer voteCount = 0;

    @Column(name = "position_order", nullable = false)
    @Builder.Default
    private Integer positionOrder = 0;

    @Column(name = "played_at")
    private LocalDateTime playedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}