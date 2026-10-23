package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.DifficultySuggestionResponse;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.AdaptiveDifficultyService;
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
@RequestMapping("/api/profiles/{id}/difficulty-suggestion")
@Tag(name = "Adaptive Difficulty", description = "Rule-based, explainable difficulty suggestions based on engagement history (Caregiver only)")
public class DifficultyController {

    private final AdaptiveDifficultyService difficultyService;
    private final OwnershipService ownershipService;

    public DifficultyController(AdaptiveDifficultyService difficultyService, OwnershipService ownershipService) {
        this.difficultyService = difficultyService;
        this.ownershipService = ownershipService;
    }

    @GetMapping
    @Operation(summary = "Get explainable difficulty suggestion for a player profile")
    public ResponseEntity<DifficultySuggestionResponse> getDifficultySuggestion(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        DifficultySuggestionResponse response = difficultyService.getDifficultySuggestion(id, principal.getId());
        return ResponseEntity.ok(response);
    }
}
