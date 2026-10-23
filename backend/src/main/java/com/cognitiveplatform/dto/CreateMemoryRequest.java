package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.MemoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateMemoryRequest {

    @NotNull(message = "Memory type is required")
    private MemoryType type;

    @NotBlank(message = "Title cannot be empty")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    private String description;
    private String transcript;
    private int sortOrder = 0;

    public CreateMemoryRequest() {}

    public CreateMemoryRequest(MemoryType type, String title, String description, String transcript, int sortOrder) {
        this.type = type;
        this.title = title;
        this.description = description;
        this.transcript = transcript;
        this.sortOrder = sortOrder;
    }

    public MemoryType getType() {
        return type;
    }

    public void setType(MemoryType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTranscript() {
        return transcript;
    }

    public void setTranscript(String transcript) {
        this.transcript = transcript;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }
}
