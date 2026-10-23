package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "patient_link_codes")
public class PatientLinkCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_profile_id", nullable = false)
    private Long playerProfileId;

    @Column(nullable = false, length = 32)
    private String code;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    public PatientLinkCode() {}

    public PatientLinkCode(Long playerProfileId, String code, Instant expiresAt, Long createdBy) {
        this.playerProfileId = playerProfileId;
        this.code = code;
        this.expiresAt = expiresAt;
        this.createdBy = createdBy;
        this.used = false;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlayerProfileId() {
        return playerProfileId;
    }

    public void setPlayerProfileId(Long playerProfileId) {
        this.playerProfileId = playerProfileId;
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

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
}
