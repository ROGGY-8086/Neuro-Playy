package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_scores", uniqueConstraints = {
        @UniqueConstraint(name = "uk_daily_scores_user_date", columnNames = {"user_id", "game_date"})
}, indexes = {
        @Index(name = "idx_daily_scores_user_date", columnList = "user_id, game_date")
})
public class DailyScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "game_date", nullable = false)
    private LocalDate gameDate;

    public DailyScore() {}

    public DailyScore(Long userId, Integer score, LocalDate gameDate) {
        this.userId = userId;
        this.score = score;
        this.gameDate = gameDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public LocalDate getGameDate() {
        return gameDate;
    }

    public void setGameDate(LocalDate gameDate) {
        this.gameDate = gameDate;
    }
}
