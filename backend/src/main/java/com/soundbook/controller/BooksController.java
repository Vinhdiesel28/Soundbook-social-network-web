package com.soundbook.controller;

import com.soundbook.dto.books.BookResponse;
import com.soundbook.service.BooksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
public class BooksController {

    private final BooksService booksService;

    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int maxResults) {
        return ResponseEntity.ok(booksService.searchBooks(q, maxResults));
    }
}
