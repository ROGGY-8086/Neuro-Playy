package com.cognitiveplatform.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DailyGameSessionDto {

    private Long sessionId;
    private LocalDate gameDate;
    private List<ClientQuestionDto> questions = new ArrayList<>();
    private Map<String, String> answerState = new HashMap<>();
    private int totalQuestions;
    private String status;

    public DailyGameSessionDto() {}

    public DailyGameSessionDto(Long sessionId, LocalDate gameDate, List<ClientQuestionDto> questions,
                               Map<String, String> answerState, String status) {
        this.sessionId = sessionId;
        this.gameDate = gameDate;
        this.questions = questions != null ? questions : new ArrayList<>();
        this.answerState = answerState != null ? answerState : new HashMap<>();
        this.totalQuestions = this.questions.size();
        this.status = status;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDate getGameDate() {
        return gameDate;
    }

    public void setGameDate(LocalDate gameDate) {
        this.gameDate = gameDate;
    }

    public List<ClientQuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<ClientQuestionDto> questions) {
        this.questions = questions != null ? questions : new ArrayList<>();
        this.totalQuestions = this.questions.size();
    }

    public Map<String, String> getAnswerState() {
        return answerState;
    }

    public void setAnswerState(Map<String, String> answerState) {
        this.answerState = answerState != null ? answerState : new HashMap<>();
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
