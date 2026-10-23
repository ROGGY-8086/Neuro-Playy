package com.cognitiveplatform.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    // In-memory token revocation registry: token -> expiration timestamp
    private final Map<String, Long> revokedTokens = new ConcurrentHashMap<>();

    public void revokeToken(String token, long expirationTimestamp) {
        if (token != null && !token.isBlank()) {
            cleanExpiredTokens();
            revokedTokens.put(token.trim(), expirationTimestamp);
        }
    }

    public boolean isRevoked(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        Long expiry = revokedTokens.get(token.trim());
        if (expiry == null) {
            return false;
        }
        if (System.currentTimeMillis() > expiry) {
            revokedTokens.remove(token.trim());
            return false;
        }
        return true;
    }

    private void cleanExpiredTokens() {
        long now = System.currentTimeMillis();
        revokedTokens.entrySet().removeIf(entry -> entry.getValue() < now);
    }
}
