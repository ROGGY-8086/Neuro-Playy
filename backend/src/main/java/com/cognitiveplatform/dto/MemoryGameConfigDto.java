package com.cognitiveplatform.dto;

import java.util.ArrayList;
import java.util.List;

public class MemoryGameConfigDto {

    private Long playerProfileId;
    private List<MemoryGameQuestionDto> questions = new ArrayList<>();
    private boolean configured;

    public MemoryGameConfigDto() {}

    public MemoryGameConfigDto(Long playerProfileId, List<MemoryGameQuestionDto> questions, boolean configured) {
        this.playerProfileId = playerProfileId;
        this.questions = questions != null ? questions : new ArrayList<>();
        this.configured = configured;
    }

    public Long getPlayerProfileId() {
        return playerProfileId;
    }

    public void setPlayerProfileId(Long playerProfileId) {
        this.playerProfileId = playerProfileId;
    }

    public List<MemoryGameQuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<MemoryGameQuestionDto> questions) {
        this.questions = questions;
    }

    public boolean isConfigured() {
        return configured;
    }

    public void setConfigured(boolean configured) {
        this.configured = configured;
    }
}
