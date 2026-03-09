package com.soundbook.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_playback_state")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomPlaybackState {

    @Id
    @Column(name = "room_id")
    private Long roomId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "track_id", length = 64)
    private String trackId;

    @Column(name = "track_payload_json", columnDefinition = "JSON")
    private String trackPayloadJson;

    @Column(name = "position_ms", nullable = false)
    @Builder.Default
    private Integer positionMs = 0;

    @Column(name = "is_playing", nullable = false)
    @Builder.Default
    private Boolean isPlaying = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
