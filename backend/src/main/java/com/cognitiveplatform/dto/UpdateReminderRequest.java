package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.ReminderStatus;
import com.cognitiveplatform.entity.ReminderType;

import java.time.Instant;

public class UpdateReminderRequest {
    private String title;
    private ReminderType type;
    private Instant scheduledAt;
    private String recurrence;
    private Boolean enabled;
    private ReminderStatus status;

    public UpdateReminderRequest() {}

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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public ReminderStatus getStatus() {
        return status;
    }

    public void setStatus(ReminderStatus status) {
        this.status = status;
    }
}
