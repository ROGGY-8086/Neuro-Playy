package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "daily_game_sessions", uniqueConstraints = {
        @UniqueConstraint(name = "uk_daily_sessions_user_date", columnNames = {"user_id", "game_date"})
})
public class DailyGameSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "game_date", nullable = false)
    private LocalDate gameDate;

    @Column(name = "question_set", nullable = false, columnDefinition = "TEXT")
    private String questionSet;

    @Column(name = "answer_state", columnDefinition = "TEXT")
    private String answerState;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "IN_PROGRESS";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public DailyGameSession() {}

    public DailyGameSession(Long userId, LocalDate gameDate, String questionSet) {
        this.userId = userId;
        this.gameDate = gameDate;
        this.questionSet = questionSet;
        this.status = "IN_PROGRESS";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
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

    public LocalDate getGameDate() {
        return gameDate;
    }

    public void setGameDate(LocalDate gameDate) {
        this.gameDate = gameDate;
    }

    public String getQuestionSet() {
        return questionSet;
    }

    public void setQuestionSet(String questionSet) {
        this.questionSet = questionSet;
    }

    public String getAnswerState() {
        return answerState;
    }

    public void setAnswerState(String answerState) {
        this.answerState = answerState;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
