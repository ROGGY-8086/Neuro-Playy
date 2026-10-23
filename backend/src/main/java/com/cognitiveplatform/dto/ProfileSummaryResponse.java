package com.cognitiveplatform.dto;

import java.util.List;
import java.util.Map;

public class ProfileSummaryResponse {
    private Long playerId;
    private String preferredName;
    private long totalSessions;
    private Map<String, Long> completionCountByGame;
    private String currentDifficulty;
    private List<GameSessionResponse> recentSessions;
    private String activityHistoryNote;
    private long activeRemindersCount;
    private long memoriesCount;

    public ProfileSummaryResponse() {}

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }

    public long getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(long totalSessions) {
        this.totalSessions = totalSessions;
    }

    public Map<String, Long> getCompletionCountByGame() {
        return completionCountByGame;
    }

    public void setCompletionCountByGame(Map<String, Long> completionCountByGame) {
        this.completionCountByGame = completionCountByGame;
    }

    public String getCurrentDifficulty() {
        return currentDifficulty;
    }

    public void setCurrentDifficulty(String currentDifficulty) {
        this.currentDifficulty = currentDifficulty;
    }

    public List<GameSessionResponse> getRecentSessions() {
        return recentSessions;
    }

    public void setRecentSessions(List<GameSessionResponse> recentSessions) {
        this.recentSessions = recentSessions;
    }

    public String getActivityHistoryNote() {
        return activityHistoryNote;
    }

    public void setActivityHistoryNote(String activityHistoryNote) {
        this.activityHistoryNote = activityHistoryNote;
    }

    public long getActiveRemindersCount() {
        return activeRemindersCount;
    }

    public void setActiveRemindersCount(long activeRemindersCount) {
        this.activeRemindersCount = activeRemindersCount;
    }

    public long getMemoriesCount() {
        return memoriesCount;
    }

    public void setMemoriesCount(long memoriesCount) {
        this.memoriesCount = memoriesCount;
    }
}
