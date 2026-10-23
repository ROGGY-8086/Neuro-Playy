package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.GardenStateRequest;
import com.cognitiveplatform.dto.GardenStateResponse;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.GardenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles/{id}/garden")
@Tag(name = "Virtual Garden", description = "Peaceful virtual garden state for calm creativity")
public class GardenController {

    private final GardenService gardenService;

    public GardenController(GardenService gardenService) {
        this.gardenService = gardenService;
    }

    @GetMapping
    @Operation(summary = "Get current virtual garden state for a player profile")
    public ResponseEntity<GardenStateResponse> getGarden(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        GardenStateResponse response = gardenService.getGardenForPrincipal(id, principal);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    @Operation(summary = "Save or update virtual garden layout and flora")
    public ResponseEntity<GardenStateResponse> updateGarden(
            @PathVariable("id") Long id,
            @Valid @RequestBody GardenStateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        GardenStateResponse response = gardenService.updateGardenForPrincipal(id, request, principal);
        return ResponseEntity.ok(response);
    }
}
