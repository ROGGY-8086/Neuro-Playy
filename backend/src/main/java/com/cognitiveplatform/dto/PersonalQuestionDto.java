package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PersonalQuestionDto {

    private Long id;
    private Long userId;

    @NotBlank(message = "Question text cannot be empty")
    private String questionText;

    @NotBlank(message = "Correct answer cannot be empty")
    private String correctAnswer;

    private String alternativeAnswers;
    private String wrongAnswer1;
    private String wrongAnswer2;
    private String wrongAnswer3;

    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category = "Personal Recall";

    @Size(max = 50, message = "Difficulty cannot exceed 50 characters")
    private String difficulty;

    private String sourceType;
    private String sourceId;
    private boolean active = true;

    public PersonalQuestionDto() {}

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

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getAlternativeAnswers() {
        return getEffectiveAlternativeAnswers();
    }

    public void setAlternativeAnswers(String alternativeAnswers) {
        this.alternativeAnswers = alternativeAnswers;
    }

    public String getWrongAnswer1() {
        return wrongAnswer1;
    }

    public void setWrongAnswer1(String wrongAnswer1) {
        this.wrongAnswer1 = wrongAnswer1;
    }

    public String getWrongAnswer2() {
        return wrongAnswer2;
    }

    public void setWrongAnswer2(String wrongAnswer2) {
        this.wrongAnswer2 = wrongAnswer2;
    }

    public String getWrongAnswer3() {
        return wrongAnswer3;
    }

    public void setWrongAnswer3(String wrongAnswer3) {
        this.wrongAnswer3 = wrongAnswer3;
    }

    public String getEffectiveAlternativeAnswers() {
        if (alternativeAnswers != null && !alternativeAnswers.isBlank()) {
            return alternativeAnswers;
        }
        java.util.List<String> list = new java.util.ArrayList<>();
        if (wrongAnswer1 != null && !wrongAnswer1.isBlank()) list.add(wrongAnswer1.trim());
        if (wrongAnswer2 != null && !wrongAnswer2.isBlank()) list.add(wrongAnswer2.trim());
        if (wrongAnswer3 != null && !wrongAnswer3.isBlank()) list.add(wrongAnswer3.trim());
        return String.join("||", list);
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
