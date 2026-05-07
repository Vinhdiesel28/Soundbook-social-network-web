package com.soundbook.controller;

import com.soundbook.dto.youtube.YouTubeVideoResponse;
import com.soundbook.service.YouTubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/youtube")
@RequiredArgsConstructor
public class YouTubeController {

    private final YouTubeService youtubeService;

    @GetMapping("/search")
    public ResponseEntity<List<YouTubeVideoResponse>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int maxResults) {
        return ResponseEntity.ok(youtubeService.searchVideos(q, maxResults));
    }

    @GetMapping("/videos/{videoId}")
    public ResponseEntity<YouTubeVideoResponse> getVideoDetails(@PathVariable String videoId) {
        YouTubeVideoResponse details = youtubeService.getVideoDetails(videoId);
        if (details == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(details);
    }
}
