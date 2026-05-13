package com.soundbook.dto.books;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private String id;
    private String title;
    private List<String> authors;
    private String description;
    private String thumbnail;
    private String previewLink;
    private Integer pageCount;
    private String publishedDate;
    private Double rating;
}
