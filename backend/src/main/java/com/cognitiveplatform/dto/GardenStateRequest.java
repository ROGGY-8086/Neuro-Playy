package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;

public class GardenStateRequest {

    @NotBlank(message = "plantsJson cannot be empty")
    private String plantsJson;

    @NotBlank(message = "itemsJson cannot be empty")
    private String itemsJson;

    public GardenStateRequest() {}

    public GardenStateRequest(String plantsJson, String itemsJson) {
        this.plantsJson = plantsJson;
        this.itemsJson = itemsJson;
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
}
