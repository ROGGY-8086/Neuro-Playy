package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.OwnershipService;
import com.cognitiveplatform.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profiles")
@Tag(name = "Player Profiles", description = "Management of loved ones' profiles, patient onboarding, and accessibility settings")
public class ProfileController {

    private final ProfileService profileService;
    private final OwnershipService ownershipService;

    public ProfileController(ProfileService profileService, OwnershipService ownershipService) {
        this.profileService = profileService;
        this.ownershipService = ownershipService;
    }

    @GetMapping
    @Operation(summary = "List all profiles managed by caregiver or the single profile linked to patient")
    public ResponseEntity<List<ProfileResponse>> getProfiles(@AuthenticationPrincipal UserPrincipal principal) {
        List<ProfileResponse> profiles = profileService.getProfilesForPrincipal(principal);
        return ResponseEntity.ok(profiles);
    }

    @PostMapping
    @Operation(summary = "Create a new player profile (Caregivers only)")
    public ResponseEntity<ProfileResponse> createProfile(
            @Valid @RequestBody CreateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        ProfileResponse response = profileService.createProfile(request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get player profile by ID")
    public ResponseEntity<ProfileResponse> getProfile(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ProfileResponse response = profileService.getProfileForPrincipal(id, principal);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update player profile settings")
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ProfileResponse response = profileService.updateProfileForPrincipal(id, request, principal);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete player profile and all associated data and files (Caregivers only)")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        profileService.deleteProfile(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/link-codes")
    @Operation(summary = "Generate a single-use 6-character link code for patient onboarding (Caregiver only)")
    public ResponseEntity<LinkCodeResponse> generateLinkCode(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        LinkCodeResponse response = profileService.generateLinkCode(id, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/patient-login")
    @Operation(summary = "Check patient login status or latest active code for a profile (Caregiver only)")
    public ResponseEntity<PatientLoginInfoResponse> getPatientLogin(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        PatientLoginInfoResponse response = profileService.getPatientLoginInfo(id, principal.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/patient-login/reset-password")
    @Operation(summary = "Reset patient account password by caregiver (Caregiver only)")
    public ResponseEntity<Map<String, String>> resetPatientPassword(
            @PathVariable("id") Long id,
            @Valid @RequestBody ResetPatientPasswordRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        profileService.resetPatientPassword(id, request.getNewPassword(), principal.getId());
        return ResponseEntity.ok(Map.of("message", "Patient password successfully reset"));
    }

    @PatchMapping("/{id}/patient-login/enabled")
    @Operation(summary = "Enable or pause patient account access by caregiver (Caregiver only)")
    public ResponseEntity<Map<String, Object>> updatePatientStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdatePatientStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        profileService.updatePatientStatus(id, request.getEnabled(), principal.getId());
        return ResponseEntity.ok(Map.of(
                "enabled", request.getEnabled(),
                "message", request.getEnabled() ? "Patient account enabled" : "Patient account paused"
        ));
    }
}
