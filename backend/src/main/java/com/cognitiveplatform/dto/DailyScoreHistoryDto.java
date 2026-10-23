package com.cognitiveplatform.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DailyScoreHistoryDto {

    public static class ScoreEntry {
        private Long id;
        private LocalDate gameDate;
        private Integer score;
        private Integer maxScore = 5;
        private String scoreFormatted;

        public ScoreEntry() {}

        public ScoreEntry(Long id, LocalDate gameDate, Integer score, Integer maxScore) {
            this.id = id;
            this.gameDate = gameDate;
            this.score = score;
            this.maxScore = maxScore != null ? maxScore : 5;
            this.scoreFormatted = score + "/" + this.maxScore;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public LocalDate getGameDate() {
            return gameDate;
        }

        public void setGameDate(LocalDate gameDate) {
            this.gameDate = gameDate;
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
            this.scoreFormatted = score + "/" + this.maxScore;
        }

        public Integer getMaxScore() {
            return maxScore;
        }

        public void setMaxScore(Integer maxScore) {
            this.maxScore = maxScore;
            this.scoreFormatted = this.score + "/" + maxScore;
        }

        public String getScoreFormatted() {
            return scoreFormatted;
        }

        public void setScoreFormatted(String scoreFormatted) {
            this.scoreFormatted = scoreFormatted;
        }
    }

    public static class DerivedStatistics {
        private int totalGamesPlayed;
        private double averageScore;
        private int bestScore;

        public DerivedStatistics() {}

        public DerivedStatistics(int totalGamesPlayed, double averageScore, int bestScore) {
            this.totalGamesPlayed = totalGamesPlayed;
            this.averageScore = averageScore;
            this.bestScore = bestScore;
        }

        public int getTotalGamesPlayed() {
            return totalGamesPlayed;
        }

        public void setTotalGamesPlayed(int totalGamesPlayed) {
            this.totalGamesPlayed = totalGamesPlayed;
        }

        public double getAverageScore() {
            return averageScore;
        }

        public void setAverageScore(double averageScore) {
            this.averageScore = averageScore;
        }

        public int getBestScore() {
            return bestScore;
        }

        public void setBestScore(int bestScore) {
            this.bestScore = bestScore;
        }
    }

    private List<ScoreEntry> history = new ArrayList<>();
    private DerivedStatistics statistics = new DerivedStatistics();

    public DailyScoreHistoryDto() {}

    public DailyScoreHistoryDto(List<ScoreEntry> history, DerivedStatistics statistics) {
        this.history = history != null ? history : new ArrayList<>();
        this.statistics = statistics != null ? statistics : new DerivedStatistics();
    }

    public List<ScoreEntry> getHistory() {
        return history;
    }

    public void setHistory(List<ScoreEntry> history) {
        this.history = history != null ? history : new ArrayList<>();
    }

    public DerivedStatistics getStatistics() {
        return statistics;
    }

    public void setStatistics(DerivedStatistics statistics) {
        this.statistics = statistics != null ? statistics : new DerivedStatistics();
    }

    public List<ScoreEntry> getScores() {
        return history;
    }

    public int getTotalGamesPlayed() {
        return statistics != null ? statistics.getTotalGamesPlayed() : 0;
    }

    public double getAverageScore() {
        return statistics != null ? statistics.getAverageScore() : 0.0;
    }

    public int getBestScore() {
        return statistics != null ? statistics.getBestScore() : 0;
    }
}
