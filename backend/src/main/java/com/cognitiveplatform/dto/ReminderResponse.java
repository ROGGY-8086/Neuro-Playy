package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.ReminderStatus;
import com.cognitiveplatform.entity.ReminderType;

import java.time.Instant;

public class ReminderResponse {
    private Long id;
    private Long playerId;
    private String title;
    private ReminderType type;
    private Instant scheduledAt;
    private String recurrence;
    private boolean enabled;
    private ReminderStatus status;
    private Long createdBy;
    private Instant createdAt;

    public ReminderResponse() {}

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public ReminderType getType() {
        return type;
    }

    public void setType(ReminderType type) {
        this.type = type;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getRecurrence() {
        return recurrence;
    }

    public void setRecurrence(String recurrence) {
        this.recurrence = recurrence;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public ReminderStatus getStatus() {
        return status;
    }

    public void setStatus(ReminderStatus status) {
        this.status = status;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
