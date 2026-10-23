package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.ConsentResponse;
import com.cognitiveplatform.dto.CreateConsentRequest;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.ConsentService;
import com.cognitiveplatform.service.OwnershipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles/{id}/consents")
@Tag(name = "Consent Records", description = "Caregiver-approved consent records for storage and engagement activities (Caregiver only)")
public class ConsentController {

    private final ConsentService consentService;
    private final OwnershipService ownershipService;

    public ConsentController(ConsentService consentService, OwnershipService ownershipService) {
        this.consentService = consentService;
        this.ownershipService = ownershipService;
    }

    @GetMapping
    @Operation(summary = "Get all consent records for a profile")
    public ResponseEntity<List<ConsentResponse>> getConsents(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        List<ConsentResponse> consents = consentService.getConsents(id, principal.getId());
        return ResponseEntity.ok(consents);
    }

    @PostMapping
    @Operation(summary = "Record or update consent status for a player profile")
    public ResponseEntity<ConsentResponse> recordConsent(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreateConsentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        ConsentResponse response = consentService.recordConsent(id, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
