package com.cognitiveplatform.dto;

import java.util.ArrayList;
import java.util.List;

public class ClientQuestionDto {

    private int index;
    private String questionText;
    private String category;
    private String imageUrl;
    private List<String> options = new ArrayList<>();

    public ClientQuestionDto() {}

    public ClientQuestionDto(int index, String questionText, String category, List<String> options) {
        this(index, questionText, category, null, options);
    }

    public ClientQuestionDto(int index, String questionText, String category, String imageUrl, List<String> options) {
        this.index = index;
        this.questionText = questionText;
        this.category = category;
        this.imageUrl = imageUrl;
        this.options = options != null ? options : new ArrayList<>();
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options != null ? options : new ArrayList<>();
    }
}
