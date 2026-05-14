package com.soundbook.service;

import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthSessionService {

    private final Map<String, ActiveSession> activeSessionsByEmail = new ConcurrentHashMap<>();

    public boolean hasActiveSession(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        ActiveSession activeSession = activeSessionsByEmail.get(normalizeEmail(email));
        if (activeSession == null) {
            return false;
        }

        if (activeSession.isExpired()) {
            activeSessionsByEmail.remove(normalizeEmail(email));
            return false;
        }

        return true;
    }

    public void saveSession(String email, String token, Date expiredAt) {
        if (email == null || email.isBlank() || token == null || token.isBlank()) {
            return;
        }

        activeSessionsByEmail.put(
                normalizeEmail(email),
                new ActiveSession(token, expiredAt)
        );
        cleanupExpiredSessions();
    }

    public void removeSession(String email, String token) {
        if (email == null || email.isBlank()) {
            return;
        }

        String normalizedEmail = normalizeEmail(email);
        ActiveSession activeSession = activeSessionsByEmail.get(normalizedEmail);
        if (activeSession == null) {
            return;
        }

        if (token == null || token.isBlank() || token.equals(activeSession.token())) {
            activeSessionsByEmail.remove(normalizedEmail);
        }
    }

    private void cleanupExpiredSessions() {
        activeSessionsByEmail.entrySet().removeIf(entry -> entry.getValue() == null || entry.getValue().isExpired());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private record ActiveSession(String token, Date expiredAt) {
        private boolean isExpired() {
            return expiredAt != null && expiredAt.before(new Date());
        }
    }
}
