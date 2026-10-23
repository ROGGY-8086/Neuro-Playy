package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.CreateGameSessionRequest;
import com.cognitiveplatform.dto.GameSessionResponse;
import com.cognitiveplatform.dto.PatchGameSessionRequest;
import com.cognitiveplatform.entity.Role;
import com.cognitiveplatform.exception.ForbiddenOperationException;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.GameSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@Tag(name = "Game Sessions", description = "Logging and retrieval of supportive engagement activity sessions")
public class GameSessionController {

    private final GameSessionService sessionService;

    public GameSessionController(GameSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/api/games/sessions")
    @Operation(summary = "Start or log a cognitive activity session")
    public ResponseEntity<GameSessionResponse> createSession(
            @RequestBody CreateGameSessionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null && principal.getRole() == Role.PATIENT) {
            if (principal.getPlayerProfileId() != null) {
                request.setPlayerId(principal.getPlayerProfileId());
            }
        }
        Long caregiverId = (principal != null && principal.getRole() != Role.PATIENT) ? principal.getId() : null;
        GameSessionResponse response = sessionService.createSession(request, caregiverId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/api/games/sessions/{id}")
    @Operation(summary = "Update or mark a cognitive activity session as completed (idempotent)")
    public ResponseEntity<GameSessionResponse> patchSession(
            @PathVariable("id") Long id,
            @RequestBody PatchGameSessionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null && principal.getRole() == Role.PATIENT) {
            // Patient can only patch their own session
            GameSessionResponse session = sessionService.getSession(id);
            if (principal.getPlayerProfileId() == null || !principal.getPlayerProfileId().equals(session.getPlayerId())) {
                throw new ForbiddenOperationException("Access denied: You can only update sessions for your own profile");
            }
        }
        Long caregiverId = (principal != null && principal.getRole() != Role.PATIENT) ? principal.getId() : null;
        GameSessionResponse response = sessionService.patchSession(id, request, caregiverId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/profiles/{id}/sessions")
    @Operation(summary = "List engagement activity history for a profile with filtering and pagination")
    public ResponseEntity<Page<GameSessionResponse>> getSessions(
            @PathVariable("id") Long id,
            @RequestParam(value = "gameKey", required = false) String gameKey,
            @RequestParam(value = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(value = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "startedAt,desc") String sort,
            @AuthenticationPrincipal UserPrincipal principal) {

        String[] sortParts = sort.split(",");
        String sortProp = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProp));
        Page<GameSessionResponse> sessions = sessionService.getSessions(id, gameKey, from, to, pageable, principal.getId());
        return ResponseEntity.ok(sessions);
    }
}
