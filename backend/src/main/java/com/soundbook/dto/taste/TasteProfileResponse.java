package com.soundbook.dto.taste;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TasteProfileResponse {
    private Long userId;
    private boolean completed;

    private List<String> musicGenres;
    private List<String> musicMoods;
    private List<String> musicArtists;
    private List<String> musicSongs;
    private List<String> musicDislikedGenres;

    private List<String> bookGenres;
    private List<String> bookThemes;
    private List<String> bookAuthors;
    private List<String> favoriteBooks;
    private List<String> bookDislikedGenres;

    private Map<String, Double> musicVector;
    private Map<String, Double> bookVector;

    private BigDecimal musicConfidence;
    private BigDecimal bookConfidence;
    private BigDecimal weightMusic;
    private BigDecimal weightBook;
    private Integer version;
    private LocalDateTime updatedAt;
}
