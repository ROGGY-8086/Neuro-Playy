package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ReorderMemoriesRequest {

    @NotEmpty(message = "Ordered memory IDs list cannot be empty")
    private List<Long> orderedMemoryIds;

    public ReorderMemoriesRequest() {}

    public ReorderMemoriesRequest(List<Long> orderedMemoryIds) {
        this.orderedMemoryIds = orderedMemoryIds;
    }

    public List<Long> getOrderedMemoryIds() {
        return orderedMemoryIds;
    }

    public void setOrderedMemoryIds(List<Long> orderedMemoryIds) {
        this.orderedMemoryIds = orderedMemoryIds;
    }
}
