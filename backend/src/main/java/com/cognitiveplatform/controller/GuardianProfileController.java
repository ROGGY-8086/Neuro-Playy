package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.GuardianProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/guardian-profile")
@Tag(name = "Guardian Profile", description = "Guardian-provided personal information, family members, life events, and custom memory questions")
public class GuardianProfileController {

    private final GuardianProfileService guardianProfileService;

    public GuardianProfileController(GuardianProfileService guardianProfileService) {
        this.guardianProfileService = guardianProfileService;
    }

    @GetMapping("/status")
    @Operation(summary = "Check if guardian profile setup is completed")
    public ResponseEntity<Map<String, Object>> getSetupStatus(@AuthenticationPrincipal UserPrincipal principal) {
        GuardianProfileBundleDto bundle = guardianProfileService.getProfileBundle(principal.getId());
        boolean completed = bundle.isSetupCompleted();
        int relCount = bundle.getRelatives() != null ? bundle.getRelatives().size() : 0;
        int eventCount = bundle.getLifeEvents() != null ? bundle.getLifeEvents().size() : 0;
        int questionCount = bundle.getPersonalQuestions() != null ? bundle.getPersonalQuestions().size() : 0;
        boolean hasBasic = bundle.getProfile() != null && bundle.getProfile().getFullName() != null
                && !bundle.getProfile().getFullName().trim().isEmpty();

        return ResponseEntity.ok(Map.of(
                "setupCompleted", completed,
                "profileComplete", completed,
                "hasBasicInfo", hasBasic,
                "relativeCount", relCount,
                "lifeEventCount", eventCount,
                "questionCount", questionCount,
                "userId", principal.getId()
        ));
    }

    @GetMapping
    @Operation(summary = "Get full guardian profile bundle including relatives, life events, and custom questions")
    public ResponseEntity<GuardianProfileBundleDto> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(guardianProfileService.getProfileBundle(principal.getId()));
    }

    @PutMapping
    @Operation(summary = "Save or update complete guardian profile bundle and mark setup completed")
    public ResponseEntity<GuardianProfileBundleDto> saveProfile(
            @Valid @RequestBody GuardianProfileBundleDto bundle,
            @AuthenticationPrincipal UserPrincipal principal) {
        GuardianProfileBundleDto saved = guardianProfileService.saveProfileBundle(principal.getId(), bundle);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/relatives")
    @Operation(summary = "Add a single relative to profile")
    public ResponseEntity<RelativeDto> addRelative(
            @Valid @RequestBody RelativeDto relativeDto,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(guardianProfileService.addRelative(principal.getId(), relativeDto));
    }

    @DeleteMapping("/relatives/{id}")
    @Operation(summary = "Delete a relative")
    public ResponseEntity<Map<String, String>> deleteRelative(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        guardianProfileService.deleteRelative(principal.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Relative deleted successfully"));
    }

    @PostMapping("/events")
    @Operation(summary = "Add a single life event to profile")
    public ResponseEntity<LifeEventDto> addLifeEvent(
            @Valid @RequestBody LifeEventDto eventDto,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(guardianProfileService.addLifeEvent(principal.getId(), eventDto));
    }

    @DeleteMapping("/events/{id}")
    @Operation(summary = "Delete a life event")
    public ResponseEntity<Map<String, String>> deleteLifeEvent(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        guardianProfileService.deleteLifeEvent(principal.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Life event deleted successfully"));
    }

    @PostMapping("/questions")
    @Operation(summary = "Add a single custom personal question to profile")
    public ResponseEntity<PersonalQuestionDto> addCustomQuestion(
            @Valid @RequestBody PersonalQuestionDto questionDto,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(guardianProfileService.addCustomQuestion(principal.getId(), questionDto));
    }

    @DeleteMapping("/questions/{id}")
    @Operation(summary = "Delete a custom question")
    public ResponseEntity<Map<String, String>> deleteCustomQuestion(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        guardianProfileService.deleteCustomQuestion(principal.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Custom question deleted successfully"));
    }
}
