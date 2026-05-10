package com.soundbook.entity;

import com.soundbook.entity.enums.ThemeMode;
import com.soundbook.entity.enums.Visibility;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "cover_url", length = 500)
    private String coverUrl;

    @Column(length = 500)
    private String bio;

    @Column(name = "public_info", length = 1000)
    private String publicInfo;

    @Enumerated(EnumType.STRING)
    @Column(name = "bio_visibility", nullable = false)
    @Builder.Default
    private Visibility bioVisibility = Visibility.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "public_info_visibility", nullable = false)
    @Builder.Default
    private Visibility publicInfoVisibility = Visibility.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "theme_mode", nullable = false)
    @Builder.Default
    private ThemeMode themeMode = ThemeMode.AUTO;

    @Column(name = "pinned_track_id", length = 64)
    private String pinnedTrackId;

    @Enumerated(EnumType.STRING)
    @Column(name = "pinned_track_visibility", nullable = false)
    @Builder.Default
    private Visibility pinnedTrackVisibility = Visibility.PUBLIC;

    @Column(name = "allow_preview_player", nullable = false)
    @Builder.Default
    private Boolean allowPreviewPlayer = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

}
