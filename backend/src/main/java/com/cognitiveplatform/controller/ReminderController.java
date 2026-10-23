package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.CreateReminderRequest;
import com.cognitiveplatform.dto.ReminderResponse;
import com.cognitiveplatform.dto.UpdateReminderRequest;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.ReminderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Reminders", description = "Caregiver-scheduled activity, hydration, meal, and routine reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping("/api/profiles/{id}/reminders")
    @Operation(summary = "List all reminders for a player profile")
    public ResponseEntity<List<ReminderResponse>> getReminders(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ReminderResponse> reminders = reminderService.getRemindersForPrincipal(id, principal);
        return ResponseEntity.ok(reminders);
    }

    @PostMapping("/api/profiles/{id}/reminders")
    @Operation(summary = "Create a new reminder for a player profile")
    public ResponseEntity<ReminderResponse> createReminder(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreateReminderRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ReminderResponse response = reminderService.createReminder(id, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/reminders/{id}")
    @Operation(summary = "Update an existing reminder")
    public ResponseEntity<ReminderResponse> updateReminder(
            @PathVariable("id") Long id,
            @RequestBody UpdateReminderRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ReminderResponse response = reminderService.updateReminder(id, request, principal.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/reminders/{id}")
    @Operation(summary = "Delete a reminder")
    public ResponseEntity<Void> deleteReminder(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        reminderService.deleteReminder(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
