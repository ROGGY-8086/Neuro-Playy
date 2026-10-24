package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.MemoryGameConfigDto;
import com.cognitiveplatform.dto.MemoryGameQuestionDto;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.MemoryGameConfigService;
import com.cognitiveplatform.service.OwnershipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Memory Game Configuration", description = "Caregiver configuration of the 5 personalized memory game questions for patients")
public class MemoryGameConfigController {

    private final MemoryGameConfigService configService;
    private final OwnershipService ownershipService;

    public MemoryGameConfigController(MemoryGameConfigService configService, OwnershipService ownershipService) {
        this.configService = configService;
        this.ownershipService = ownershipService;
    }

    @GetMapping("/profiles/{id}/memory-game-config")
    @Operation(summary = "Get memory game question configuration for player profile (Caregiver only)")
    public ResponseEntity<MemoryGameConfigDto> getConfig(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        return ResponseEntity.ok(configService.getConfig(id, principal.getId()));
    }

    @PutMapping("/profiles/{id}/memory-game-config")
    @Operation(summary = "Save or update exactly 5 memory game questions for player profile (Caregiver only)")
    public ResponseEntity<MemoryGameConfigDto> saveConfig(
            @PathVariable("id") Long id,
            @Valid @RequestBody List<MemoryGameQuestionDto> questions,
            @AuthenticationPrincipal UserPrincipal principal) {
        ownershipService.verifyCaregiverRole(principal);
        return ResponseEntity.ok(configService.saveConfig(id, principal.getId(), questions));
    }
}
