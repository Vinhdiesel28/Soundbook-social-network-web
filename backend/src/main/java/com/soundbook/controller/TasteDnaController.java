package com.soundbook.controller;

import com.soundbook.common.dto.ApiResponse;
import com.soundbook.dto.taste.DiscoverItemResponse;
import com.soundbook.dto.taste.MatchUserResponse;
import com.soundbook.dto.taste.PreferenceRequest;
import com.soundbook.dto.taste.TasteProfileResponse;
import com.soundbook.service.TasteDnaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/taste")
@RequiredArgsConstructor
public class TasteDnaController {

    private final TasteDnaService tasteDnaService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<TasteProfileResponse>> getMyTaste(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(tasteDnaService.getMyTaste(authentication.getName())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<TasteProfileResponse>> saveMyTaste(
            Authentication authentication,
            @RequestBody PreferenceRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(tasteDnaService.saveMyTaste(authentication.getName(), request)));
    }

    @GetMapping("/matches")
    public ResponseEntity<ApiResponse<List<MatchUserResponse>>> getMatches(
            Authentication authentication,
            @RequestParam(name = "limit", required = false) Integer limit
    ) {
        return ResponseEntity.ok(ApiResponse.success(tasteDnaService.getRecommendedMatches(authentication.getName(), limit)));
    }

    @GetMapping("/match/{userId}")
    public ResponseEntity<ApiResponse<MatchUserResponse>> getMatchWithUser(
            Authentication authentication,
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(ApiResponse.success(tasteDnaService.getMatchWithUser(authentication.getName(), userId)));
    }

    @GetMapping("/discover")
    public ResponseEntity<ApiResponse<List<DiscoverItemResponse>>> getDiscover(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(tasteDnaService.getDiscoverSeed(authentication.getName())));
    }
}
