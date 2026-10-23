package com.cognitiveplatform.dto;

import java.time.Instant;

public class PatchGameSessionRequest {
    private Boolean completed;
    private Instant endedAt;
    private String metricsJson;

    public PatchGameSessionRequest() {}

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Instant getEndedAt() {
        return endedAt;
    }

    public void setEndedAt(Instant endedAt) {
        this.endedAt = endedAt;
    }

    public String getMetricsJson() {
        return metricsJson;
    }

    public void setMetricsJson(String metricsJson) {
        this.metricsJson = metricsJson;
    }
}
