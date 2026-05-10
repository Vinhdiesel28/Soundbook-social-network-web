package com.soundbook.dto.taste;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceRequest {
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

    private BigDecimal weightMusic;
    private BigDecimal weightBook;
}
