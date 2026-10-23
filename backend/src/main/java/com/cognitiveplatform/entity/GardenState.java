package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "garden_states")
public class GardenState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_id", nullable = false, unique = true)
    private Long playerId;

    @Column(name = "plants_json", nullable = false, columnDefinition = "TEXT")
    private String plantsJson = "[]";

    @Column(name = "items_json", nullable = false, columnDefinition = "TEXT")
    private String itemsJson = "[]";

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public GardenState() {}

    public GardenState(Long playerId, String plantsJson, String itemsJson) {
        this.playerId = playerId;
        this.plantsJson = plantsJson != null ? plantsJson : "[]";
        this.itemsJson = itemsJson != null ? itemsJson : "[]";
        this.updatedAt = Instant.now();
    }

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
