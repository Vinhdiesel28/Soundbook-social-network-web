package com.soundbook.entity;

import com.soundbook.entity.enums.DnaBuiltFrom;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_music_dna")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMusicDna {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "built_from", nullable = false)
    private DnaBuiltFrom builtFrom;

    @Column(name = "prefs_json", nullable = false, columnDefinition = "JSON")
    private String prefsJson;

    @Column(name = "vector_json", nullable = false, columnDefinition = "JSON")
    private String vectorJson;

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "calculated_at", nullable = false)
    @Builder.Default
    private LocalDateTime calculatedAt = LocalDateTime.now();
}
