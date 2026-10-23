package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.ProfileSummaryResponse;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.DashboardService;
import com.cognitiveplatform.service.OwnershipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profiles/{id}/summary")
@Tag(name = "Dashboard Summary", description = "Overview of recent engagement activities and routines (Caregiver only)")
public class DashboardController {

    private final DashboardService dashboardService;
    private final OwnershipService ownershipService;

    public DashboardController(DashboardService dashboardService, OwnershipService ownershipService) {
        this.dashboardService = dashboardService;
        this.ownershipService = ownershipService;
    }

    @GetMapping
    @Operation(summary = "Get aggregated activity summary and completion history for a player profile")
    public ResponseEntity<ProfileSummaryResponse> getSummary(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        ProfileSummaryResponse response = dashboardService.getProfileSummary(id, principal.getId());
        return ResponseEntity.ok(response);
    }
}
