package com.cognitiveplatform.dto;

public class RadarAgentDto {
    private Long id;
    private String label;
    private int x;
    private int y;
    private String status;
    private String speech;
    private int decayTime;

    public RadarAgentDto() {}

    public RadarAgentDto(Long id, String label, int x, int y, String status, String speech, int decayTime) {
        this.id = id;
        this.label = label;
        this.x = x;
        this.y = y;
        this.status = status;
        this.speech = speech;
        this.decayTime = decayTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSpeech() {
        return speech;
    }

    public void setSpeech(String speech) {
        this.speech = speech;
    }

    public int getDecayTime() {
        return decayTime;
    }

    public void setDecayTime(int decayTime) {
        this.decayTime = decayTime;
    }
}
