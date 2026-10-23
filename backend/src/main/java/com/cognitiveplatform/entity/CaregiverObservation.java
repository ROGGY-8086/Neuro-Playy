package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "caregiver_observations")
public class CaregiverObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false)
    private Long playerId;

    @Column(name = "session_id")
    private Long sessionId;

    @Column(name = "mood_note", length = 500)
    private String moodNote;

    @Column(name = "assistance_note", length = 500)
    private String assistanceNote;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    public CaregiverObservation() {}

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

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getMoodNote() {
        return moodNote;
    }

    public void setMoodNote(String moodNote) {
        this.moodNote = moodNote;
    }

    public String getAssistanceNote() {
        return assistanceNote;
    }

    public void setAssistanceNote(String assistanceNote) {
        this.assistanceNote = assistanceNote;
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
