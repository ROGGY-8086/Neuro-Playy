package com.cognitiveplatform.dto;

import java.time.Instant;

public class ObservationResponse {
    private Long id;
    private Long playerId;
    private Long sessionId;
    private String moodNote;
    private String assistanceNote;
    private Instant createdAt;
    private Long createdBy;

    public ObservationResponse() {}

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
