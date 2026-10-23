package com.cognitiveplatform.dto;

import java.time.LocalDate;

public class DailyGameResultDto {

    private int score;
    private int totalQuestions;
    private String scoreText;
    private String message;
    private LocalDate gameDate;
    private boolean newlyCredited;

    public DailyGameResultDto() {}

    public DailyGameResultDto(int score, int totalQuestions, String message, LocalDate gameDate, boolean newlyCredited) {
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.scoreText = score + "/" + totalQuestions;
        this.message = message;
        this.gameDate = gameDate;
        this.newlyCredited = newlyCredited;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
        this.scoreText = score + "/" + totalQuestions;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public int getPercentage() {
        return totalQuestions > 0 ? (int) Math.round(((double) score / totalQuestions) * 100) : 0;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
        this.scoreText = score + "/" + totalQuestions;
    }

    public String getScoreText() {
        return scoreText;
    }

    public void setScoreText(String scoreText) {
        this.scoreText = scoreText;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDate getGameDate() {
        return gameDate;
    }

    public void setGameDate(LocalDate gameDate) {
        this.gameDate = gameDate;
    }

    public boolean isNewlyCredited() {
        return newlyCredited;
    }

    public void setNewlyCredited(boolean newlyCredited) {
        this.newlyCredited = newlyCredited;
    }
}
