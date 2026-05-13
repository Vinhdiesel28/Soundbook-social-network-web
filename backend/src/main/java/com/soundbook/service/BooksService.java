package com.soundbook.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.soundbook.dto.books.BookResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BooksService {

    @Value("${google.api-key:}")
    private String apiKey;

    private static final String BOOKS_API_BASE = "https://www.googleapis.com/books/v1";
    private final RestTemplate restTemplate;

    public List<BookResponse> searchBooks(String query, int maxResults) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(BOOKS_API_BASE + "/volumes")
                .queryParam("q", query)
                .queryParam("maxResults", maxResults);

        if (apiKey != null && !apiKey.isEmpty()) {
            builder.queryParam("key", apiKey);
        }

        String url = builder.toUriString();

        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            List<BookResponse> books = new ArrayList<>();

            if (response != null && response.has("items")) {
                for (JsonNode item : response.get("items")) {
                    JsonNode info = item.get("volumeInfo");
                    
                    List<String> authors = new ArrayList<>();
                    if (info.has("authors")) {
                        info.get("authors").forEach(a -> authors.add(a.asText()));
                    }

                    String thumbnail = null;
                    if (info.has("imageLinks")) {
                        JsonNode links = info.get("imageLinks");
                        thumbnail = links.has("thumbnail") ? links.get("thumbnail").asText() : 
                                   (links.has("smallThumbnail") ? links.get("smallThumbnail").asText() : null);
                    }

                    books.add(BookResponse.builder()
                            .id(item.get("id").asText())
                            .title(info.has("title") ? info.get("title").asText() : "Unknown")
                            .authors(authors)
                            .description(info.has("description") ? info.get("description").asText() : "")
                            .thumbnail(thumbnail)
                            .previewLink(info.has("previewLink") ? info.get("previewLink").asText() : null)
                            .pageCount(info.has("pageCount") ? info.get("pageCount").asInt() : 0)
                            .publishedDate(info.has("publishedDate") ? info.get("publishedDate").asText() : null)
                            .rating(info.has("averageRating") ? info.get("averageRating").asDouble() : 0.0)
                            .build());
                }
            }
            return books;
        } catch (Exception e) {
            log.error("Error calling Google Books API search", e);
            return new ArrayList<>();
        }
    }
}
