package com.cognitiveplatform.dto;

public class CreateGameSessionRequest {

    private Long playerId;
    private String gameKey;
    private String pillarId; // Alternate field used by frontend drills
    private String difficulty = "STANDARD";
    private boolean completed = false;
    private String metricsJson;

    // Frontend convenience fields
    private Double score;
    private Double accuracy;
    private Integer durationSeconds;

    public CreateGameSessionRequest() {}

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getGameKey() {
        if (gameKey != null && !gameKey.isBlank()) {
            return gameKey;
        }
        return pillarId;
    }

    public void setGameKey(String gameKey) {
        this.gameKey = gameKey;
    }

    public String getPillarId() {
        return pillarId;
    }

    public void setPillarId(String pillarId) {
        this.pillarId = pillarId;
        if (this.gameKey == null) {
            this.gameKey = pillarId;
        }
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

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
}
