package com.cognitiveplatform.dto;

import java.time.LocalDate;

public class DailyGameStatusDto {

    private LocalDate gameDate;
    private boolean hasCompletedToday;
    private Integer todayScore;
    private Integer maxScore;
    private boolean hasActiveSession;
    private int totalQuestions;
    private boolean hasProfileData;

    public DailyGameStatusDto() {}

    public DailyGameStatusDto(LocalDate gameDate, boolean hasCompletedToday, Integer todayScore, Integer maxScore,
                              boolean hasActiveSession, int totalQuestions, boolean hasProfileData) {
        this.gameDate = gameDate;
        this.hasCompletedToday = hasCompletedToday;
        this.todayScore = todayScore;
        this.maxScore = maxScore;
        this.hasActiveSession = hasActiveSession;
        this.totalQuestions = totalQuestions;
        this.hasProfileData = hasProfileData;
    }

    public LocalDate getGameDate() {
        return gameDate;
    }

    public void setGameDate(LocalDate gameDate) {
        this.gameDate = gameDate;
    }

    public boolean isHasCompletedToday() {
        return hasCompletedToday;
    }

    public boolean isHasPlayedToday() {
        return hasCompletedToday;
    }

    public boolean isCanPlay() {
        return !hasCompletedToday && hasProfileData;
    }

    public void setHasCompletedToday(boolean hasCompletedToday) {
        this.hasCompletedToday = hasCompletedToday;
    }

    public Integer getTodayScore() {
        return todayScore;
    }

    public void setTodayScore(Integer todayScore) {
        this.todayScore = todayScore;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public boolean isHasActiveSession() {
        return hasActiveSession;
    }

    public void setHasActiveSession(boolean hasActiveSession) {
        this.hasActiveSession = hasActiveSession;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public boolean isHasProfileData() {
        return hasProfileData;
    }

    public void setHasProfileData(boolean hasProfileData) {
        this.hasProfileData = hasProfileData;
    }
}
