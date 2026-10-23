package com.cognitiveplatform.dto;

import java.time.Instant;

public class LinkCodeResponse {

    private String code;
    private Instant expiresAt;
    private Long profileId;

    public LinkCodeResponse() {}

    public LinkCodeResponse(String code, Instant expiresAt, Long profileId) {
        this.code = code;
        this.expiresAt = expiresAt;
        this.profileId = profileId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }
}
