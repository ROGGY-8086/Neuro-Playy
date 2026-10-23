package com.cognitiveplatform.dto;

import java.time.Instant;

public class PatientLoginInfoResponse {

    private boolean hasLogin;
    private String username;
    private String name;
    private boolean enabled;
    private Instant createdAt;
    private String activeCode;
    private Instant codeExpiresAt;

    public PatientLoginInfoResponse() {}

    public static PatientLoginInfoResponse withAccount(String username, String name, boolean enabled, Instant createdAt) {
        PatientLoginInfoResponse res = new PatientLoginInfoResponse();
        res.setHasLogin(true);
        res.setUsername(username);
        res.setName(name);
        res.setEnabled(enabled);
        res.setCreatedAt(createdAt);
        return res;
    }

    public static PatientLoginInfoResponse noAccount(String activeCode, Instant codeExpiresAt) {
        PatientLoginInfoResponse res = new PatientLoginInfoResponse();
        res.setHasLogin(false);
        res.setActiveCode(activeCode);
        res.setCodeExpiresAt(codeExpiresAt);
        return res;
    }

    public boolean isHasLogin() {
        return hasLogin;
    }

    public void setHasLogin(boolean hasLogin) {
        this.hasLogin = hasLogin;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getActiveCode() {
        return activeCode;
    }

    public void setActiveCode(String activeCode) {
        this.activeCode = activeCode;
    }

    public Instant getCodeExpiresAt() {
        return codeExpiresAt;
    }

    public void setCodeExpiresAt(Instant codeExpiresAt) {
        this.codeExpiresAt = codeExpiresAt;
    }
}
