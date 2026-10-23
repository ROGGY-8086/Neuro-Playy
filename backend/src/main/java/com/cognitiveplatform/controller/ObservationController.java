package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.CreateObservationRequest;
import com.cognitiveplatform.dto.ObservationResponse;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.ObservationService;
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
@RequestMapping("/api/profiles/{id}/observations")
@Tag(name = "Caregiver Observations", description = "Non-clinical qualitative support notes on mood and engagement (Caregiver only)")
public class ObservationController {

    private final ObservationService observationService;
    private final OwnershipService ownershipService;

    public ObservationController(ObservationService observationService, OwnershipService ownershipService) {
        this.observationService = observationService;
        this.ownershipService = ownershipService;
    }

    @GetMapping
    @Operation(summary = "List all qualitative observations for a player profile")
    public ResponseEntity<List<ObservationResponse>> getObservations(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        List<ObservationResponse> observations = observationService.getObservations(id, principal.getId());
        return ResponseEntity.ok(observations);
    }

    @PostMapping
    @Operation(summary = "Record a new qualitative support note or mood observation")
    public ResponseEntity<ObservationResponse> addObservation(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreateObservationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        ObservationResponse response = observationService.addObservation(id, request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
