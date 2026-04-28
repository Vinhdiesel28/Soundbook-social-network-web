package com.soundbook.entity;

import com.soundbook.common.converter.DoubleListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_book_dna")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBookDna {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Convert(converter = DoubleListConverter.class)
    @Column(name = "prefs_json", nullable = false, columnDefinition = "JSON")
    private List<Double> musicVector; // Đã đổi thành List<Double> thay vì String

    @Convert(converter = DoubleListConverter.class)
    @Column(name = "vector_json", nullable = false, columnDefinition = "JSON")
    private List<Double> bookVector; // Đã đổi thành List<Double> thay vì String

    @Column(nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "calculated_at", nullable = false)
    @Builder.Default
    private LocalDateTime calculatedAt = LocalDateTime.now();
}
