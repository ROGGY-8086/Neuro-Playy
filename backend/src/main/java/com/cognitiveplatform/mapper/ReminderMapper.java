package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.CreateReminderRequest;
import com.cognitiveplatform.dto.ReminderResponse;
import com.cognitiveplatform.dto.UpdateReminderRequest;
import com.cognitiveplatform.entity.Reminder;
import com.cognitiveplatform.entity.ReminderStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ReminderMapper {

    public Reminder toEntity(CreateReminderRequest request, Long playerId, Long creatorId) {
        if (request == null) return null;
        Reminder reminder = new Reminder();
        reminder.setPlayerId(playerId);
        reminder.setTitle(request.getTitle());
        reminder.setType(request.getType());
        reminder.setScheduledAt(request.getScheduledAt());
        reminder.setRecurrence(request.getRecurrence() != null ? request.getRecurrence() : "NONE");
        reminder.setEnabled(request.isEnabled());
        reminder.setStatus(ReminderStatus.PENDING);
        reminder.setCreatedBy(creatorId);
        reminder.setCreatedAt(Instant.now());
        return reminder;
    }

    public void updateEntity(Reminder reminder, UpdateReminderRequest request) {
        if (reminder == null || request == null) return;
        if (request.getTitle() != null) reminder.setTitle(request.getTitle());
        if (request.getType() != null) reminder.setType(request.getType());
        if (request.getScheduledAt() != null) reminder.setScheduledAt(request.getScheduledAt());
        if (request.getRecurrence() != null) reminder.setRecurrence(request.getRecurrence());
        if (request.getEnabled() != null) reminder.setEnabled(request.getEnabled());
        if (request.getStatus() != null) reminder.setStatus(request.getStatus());
    }

    public ReminderResponse toResponse(Reminder reminder) {
        if (reminder == null) return null;
        ReminderResponse resp = new ReminderResponse();
        resp.setId(reminder.getId());
        resp.setPlayerId(reminder.getPlayerId());
        resp.setTitle(reminder.getTitle());
        resp.setType(reminder.getType());
        resp.setScheduledAt(reminder.getScheduledAt());
        resp.setRecurrence(reminder.getRecurrence());
        resp.setEnabled(reminder.isEnabled());
        resp.setStatus(reminder.getStatus());
        resp.setCreatedBy(reminder.getCreatedBy());
        resp.setCreatedAt(reminder.getCreatedAt());
        return resp;
    }
}
