package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.ArrayList;
import java.util.List;

public class MemoryGameQuestionDto {

    private Long id;

    @NotBlank(message = "Question text cannot be empty")
    private String questionText;

    private String imageUrl;

    @NotBlank(message = "Correct answer cannot be empty")
    private String correctAnswer;

    @NotEmpty(message = "Answer options must not be empty")
    private List<String> options = new ArrayList<>();

    private Integer sortOrder = 0;

    public MemoryGameQuestionDto() {}

    public MemoryGameQuestionDto(Long id, String questionText, String imageUrl, String correctAnswer, List<String> options, Integer sortOrder) {
        this.id = id;
        this.questionText = questionText;
        this.imageUrl = imageUrl;
        this.correctAnswer = correctAnswer;
        this.options = options != null ? options : new ArrayList<>();
        this.sortOrder = sortOrder != null ? sortOrder : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
