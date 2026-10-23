package com.cognitiveplatform.security;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Component
public class PasswordHasher {

    private final PasswordEncoder passwordEncoder;

    public PasswordHasher(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String hash(String rawPassword) {
        return passwordEncoder.encode(preHash(rawPassword));
    }

    public boolean matches(String rawPassword, String encodedHash) {
        if (rawPassword == null || encodedHash == null) {
            return false;
        }

        // 1. Check pre-hashed match (handles passwords up to 128 chars without BCrypt 72-byte truncation)
        if (passwordEncoder.matches(preHash(rawPassword), encodedHash)) {
            return true;
        }

        // 2. Backward compatibility fallback for legacy direct hashes
        return passwordEncoder.matches(rawPassword, encodedHash);
    }

    public String preHash(String password) {
        if (password == null) return "";
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return password;
        }
    }
}
