package com.cognitiveplatform.dto;

import java.time.Instant;

public class GameSessionResponse {
    private Long id;
    private String sessionId;
    private Long playerId;
    private String gameKey;
    private Instant startedAt;
    private Instant endedAt;
    private String difficulty;
    private boolean completed;
    private String metricsJson;
    private String status;

    public GameSessionResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
        this.sessionId = id != null ? id.toString() : null;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getGameKey() {
        return gameKey;
    }

    public void setGameKey(String gameKey) {
        this.gameKey = gameKey;
    }

    public Instant getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(Instant endedAt) {
        this.endedAt = endedAt;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getMetricsJson() {
        return metricsJson;
    }

    public void setMetricsJson(String metricsJson) {
        this.metricsJson = metricsJson;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
