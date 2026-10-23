package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "consent_records")
public class ConsentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false)
    private Long playerId;

    @Column(name = "caregiver_id", nullable = false)
    private Long caregiverId;

    @Column(name = "consent_type", nullable = false, length = 100)
    private String consentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ConsentStatus status = ConsentStatus.GRANTED;

    @Column(name = "recorded_at", nullable = false, updatable = false)
    private Instant recordedAt = Instant.now();

    public ConsentRecord() {}

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
