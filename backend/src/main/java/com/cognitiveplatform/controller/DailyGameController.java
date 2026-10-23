package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.DailyMemoryGameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/daily-game")
@Tag(name = "Daily Memory Game", description = "Personalized daily MCQ memory game generated from guardian-provided profile facts")
public class DailyGameController {

    private final DailyMemoryGameService dailyMemoryGameService;

    public DailyGameController(DailyMemoryGameService dailyMemoryGameService) {
        this.dailyMemoryGameService = dailyMemoryGameService;
    }

    @GetMapping("/status")
    @Operation(summary = "Get today's daily memory game status for authenticated user")
    public ResponseEntity<DailyGameStatusDto> getTodayStatus(@AuthenticationPrincipal UserPrincipal principal) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok(dailyMemoryGameService.getStatus(principal.getId(), today));
    }

    @PostMapping("/start")
    @Operation(summary = "Start or resume today's daily memory game session")
    public ResponseEntity<DailyGameSessionDto> startOrResumeGame(@AuthenticationPrincipal UserPrincipal principal) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok(dailyMemoryGameService.startOrResumeSession(principal.getId(), today));
    }

    @PostMapping("/answer")
    @Operation(summary = "Submit a temporary answer choice in the active session")
    public ResponseEntity<DailyGameSessionDto> submitAnswer(
            @Valid @RequestBody DailyGameAnswerRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok(dailyMemoryGameService.submitAnswer(
                principal.getId(),
                today,
                request.getQuestionIndex(),
                request.getSelectedOption()
        ));
    }

    @PostMapping("/complete")
    @Operation(summary = "Complete today's daily memory game, verify answers, and save final score")
    public ResponseEntity<DailyGameResultDto> completeGame(@AuthenticationPrincipal UserPrincipal principal) {
        LocalDate today = LocalDate.now();
        return ResponseEntity.ok(dailyMemoryGameService.completeGame(principal.getId(), today));
    }

    @GetMapping("/scores")
    @Operation(summary = "Get historical daily scores and derived statistics (average, best score, total games)")
    public ResponseEntity<DailyScoreHistoryDto> getScoreHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dailyMemoryGameService.getScoreHistory(principal.getId()));
    }
}
