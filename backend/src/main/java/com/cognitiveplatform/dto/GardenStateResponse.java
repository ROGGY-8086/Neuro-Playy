package com.cognitiveplatform.dto;

import java.time.Instant;

public class GardenStateResponse {
    private Long id;
    private Long playerId;
    private String plantsJson;
    private String itemsJson;
    private Instant updatedAt;

    public GardenStateResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getPlantsJson() {
        return plantsJson;
    }

    public void setPlantsJson(String plantsJson) {
        this.plantsJson = plantsJson;
    }

    public String getItemsJson() {
        return itemsJson;
    }

    public void setItemsJson(String itemsJson) {
        this.itemsJson = itemsJson;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
