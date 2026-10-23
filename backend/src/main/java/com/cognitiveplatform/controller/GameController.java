package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.GameResponse;
import com.cognitiveplatform.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@Tag(name = "Games Catalog", description = "List of accessible cognitive and memory engagement games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    @Operation(summary = "List all enabled games in the catalog")
    public ResponseEntity<List<GameResponse>> getGames() {
        List<GameResponse> games = gameService.getEnabledGames();
        return ResponseEntity.ok(games);
    }
}
