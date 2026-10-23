package com.cognitiveplatform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "radar_agents")
public class RadarAgentEntity {

    @Id
    private Long id;

    @Column(nullable = false, length = 50)
    private String label;

    @Column(nullable = false)
    private int x;

    @Column(nullable = false)
    private int y;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(nullable = false, length = 255)
    private String speech;

    @Column(name = "decay_time", nullable = false)
    private int decayTime;

    public RadarAgentEntity() {}

    public RadarAgentEntity(Long id, String label, int x, int y, String status, String speech, int decayTime) {
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
