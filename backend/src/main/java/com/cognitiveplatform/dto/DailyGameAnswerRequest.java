package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotNull;

public class DailyGameAnswerRequest {

    @NotNull(message = "Question index is required")
    private Integer questionIndex;

    private String selectedOption;

    public DailyGameAnswerRequest() {}

    public DailyGameAnswerRequest(Integer questionIndex, String selectedOption) {
        this.questionIndex = questionIndex;
        this.selectedOption = selectedOption;
    }

    public Integer getQuestionIndex() {
        return questionIndex;
    }

    public void setQuestionIndex(Integer questionIndex) {
        this.questionIndex = questionIndex;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}
