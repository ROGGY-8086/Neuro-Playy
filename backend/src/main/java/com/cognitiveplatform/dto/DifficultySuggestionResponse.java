package com.cognitiveplatform.dto;

public class DifficultySuggestionResponse {
    private String currentLevel;
    private String suggestedLevel;
    private String reason;
    private int basedOnSessions;

    public DifficultySuggestionResponse() {}

    public DifficultySuggestionResponse(String currentLevel, String suggestedLevel, String reason, int basedOnSessions) {
        this.currentLevel = currentLevel;
        this.suggestedLevel = suggestedLevel;
        this.reason = reason;
        this.basedOnSessions = basedOnSessions;
    }

    public String getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(String currentLevel) {
        this.currentLevel = currentLevel;
    }

    public String getSuggestedLevel() {
        return suggestedLevel;
    }

    public void setSuggestedLevel(String suggestedLevel) {
        this.suggestedLevel = suggestedLevel;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public int getBasedOnSessions() {
        return basedOnSessions;
    }

    public void setBasedOnSessions(int basedOnSessions) {
        this.basedOnSessions = basedOnSessions;
    }
}
