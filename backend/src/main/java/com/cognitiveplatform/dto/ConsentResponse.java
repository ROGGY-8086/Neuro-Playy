package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.ConsentStatus;
import java.time.Instant;

public class ConsentResponse {
    private Long id;
    private Long playerId;
    private Long caregiverId;
    private String consentType;
    private ConsentStatus status;
    private Instant recordedAt;

    public ConsentResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public Long getCaregiverId() {
        return caregiverId;
    }

    public void setCaregiverId(Long caregiverId) {
        this.caregiverId = caregiverId;
    }

    public String getConsentType() {
        return consentType;
    }

    public void setConsentType(String consentType) {
        this.consentType = consentType;
    }

    public ConsentStatus getStatus() {
        return status;
    }

    public void setStatus(ConsentStatus status) {
        this.status = status;
    }

    public Instant getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(Instant recordedAt) {
        this.recordedAt = recordedAt;
    }
}
