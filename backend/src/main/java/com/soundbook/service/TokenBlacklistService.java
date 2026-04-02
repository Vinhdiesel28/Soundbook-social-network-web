package com.soundbook.service;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, Date> blacklistedTokens = new ConcurrentHashMap<>();

    public boolean isBlacklisted(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }

        Date expiredAt = blacklistedTokens.get(token);
        if (expiredAt == null) {
            return false;
        }

        if (expiredAt.before(new Date())) {
            blacklistedTokens.remove(token);
            return false;
        }

        return true;
    }

    public void blacklistToken(String token, Date expiredAt) {
        if (token == null || token.isBlank()) {
            return;
        }

        blacklistedTokens.put(
                token,
                expiredAt != null ? expiredAt : new Date(System.currentTimeMillis() + 86_400_000)
        );
        cleanupExpiredTokens();
    }

    private void cleanupExpiredTokens() {
        Date now = new Date();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue() == null || entry.getValue().before(now));
    }
}