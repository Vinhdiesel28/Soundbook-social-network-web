package com.soundbook.entity;

import com.soundbook.common.converter.DoubleListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_taste_dna")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTasteDna {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Convert(converter = DoubleListConverter.class)
    @Column(name = "music_vector_json", nullable = false, columnDefinition = "JSON")
    private List<Double> musicVector; // Đã đổi thành List<Double> thay vì String

    @Convert(converter = DoubleListConverter.class)
    @Column(name = "book_vector_json", nullable = false, columnDefinition = "JSON")
    private List<Double> bookVector; // Đã đổi thành List<Double> thay vì String

    @Column(name = "w_music", nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal wMusic = new BigDecimal("0.50");

    @Column(name = "w_book", nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal wBook = new BigDecimal("0.50");

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "calculated_at", nullable = false)
    @Builder.Default
    private LocalDateTime calculatedAt = LocalDateTime.now();
}
