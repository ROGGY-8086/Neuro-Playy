package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.CompanionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Companion Features", description = "Live cognitive telemetry, tactical radar, simulator, and pillars for the frontend")
public class CompanionController {

    private final CompanionService companionService;

    public CompanionController(CompanionService companionService) {
        this.companionService = companionService;
    }

    @GetMapping("/telemetry")
    @Operation(summary = "Get live telemetry and buffer state")
    public ResponseEntity<TelemetryDto> getTelemetry() {
        return ResponseEntity.ok(companionService.getTelemetry());
    }

    @PutMapping("/telemetry")
    @Operation(summary = "Update telemetry state")
    public ResponseEntity<TelemetryDto> updateTelemetry(@RequestBody TelemetryDto updates) {
        return ResponseEntity.ok(companionService.updateTelemetry(updates));
    }

    @GetMapping("/pillars")
    @Operation(summary = "Get cognitive pillars catalog")
    public ResponseEntity<List<CognitivePillarDto>> getPillars() {
        return ResponseEntity.ok(companionService.getPillars());
    }

    @GetMapping("/radar/agents")
    @Operation(summary = "Get active distraction agents on tactical radar")
    public ResponseEntity<List<RadarAgentDto>> getRadarAgents() {
        return ResponseEntity.ok(companionService.getRadarAgents());
    }

    @PostMapping("/radar/neutralise/{id}")
    @Operation(summary = "Deploy isometric shield and neutralize distraction agent")
    public ResponseEntity<Map<String, Object>> neutraliseAgent(@PathVariable("id") Long id) {
        return ResponseEntity.ok(companionService.neutraliseAgent(id));
    }

    @PostMapping("/radar/reset")
    @Operation(summary = "Reset tactical radar distraction agents")
    public ResponseEntity<List<RadarAgentDto>> resetRadarAgents() {
        return ResponseEntity.ok(companionService.resetRadarAgents());
    }

    @GetMapping("/simulator/stages")
    @Operation(summary = "Get simulator challenge stages")
    public ResponseEntity<List<SimulatorStageDto>> getSimulatorStages() {
        return ResponseEntity.ok(companionService.getSimulatorStages());
    }

    @GetMapping("/testimonials")
    @Operation(summary = "Get cohort community testimonials")
    public ResponseEntity<List<CohortTestimonialDto>> getTestimonials() {
        return ResponseEntity.ok(companionService.getCohortTestimonials());
    }

    @GetMapping("/settings")
    @Operation(summary = "Get accessibility settings")
    public ResponseEntity<UserSettingsDto> getSettings(@AuthenticationPrincipal UserPrincipal principal) {
        Long userId = (principal != null) ? principal.getId() : null;
        return ResponseEntity.ok(companionService.getSettings(userId));
    }

    @PutMapping("/settings")
    @Operation(summary = "Save accessibility settings")
    public ResponseEntity<UserSettingsDto> saveSettings(
            @RequestBody UserSettingsDto settings,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = (principal != null) ? principal.getId() : null;
        return ResponseEntity.ok(companionService.saveSettings(settings, userId));
    }
}
