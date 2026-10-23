package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.ReminderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public class CreateReminderRequest {

    @NotBlank(message = "Title cannot be empty")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    @NotNull(message = "Reminder type is required")
    private ReminderType type = ReminderType.ACTIVITY;

    @NotNull(message = "Scheduled time is required")
    private Instant scheduledAt;

    private String recurrence = "NONE";
    private boolean enabled = true;

    public CreateReminderRequest() {}

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
}
