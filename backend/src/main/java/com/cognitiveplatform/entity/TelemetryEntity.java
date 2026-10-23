package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "telemetry_state")
public class TelemetryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recall_balance", nullable = false)
    private double recallBalance;

    @Column(name = "per_second_gain", nullable = false)
    private double perSecondGain;

    @Column(nullable = false, length = 50)
    private String velocity;

    @Column(name = "error_drift_index", nullable = false, length = 50)
    private String errorDriftIndex;

    @Column(name = "daily_focus_fee", nullable = false)
    private int dailyFocusFee;

    @Column(name = "focus_tax", nullable = false)
    private int focusTax;

    @Column(name = "daily_model_ramp", nullable = false)
    private int dailyModelRamp;

    @Column(name = "xp_per_min", nullable = false)
    private int xpPerMin;

    @Column(nullable = false)
    private double streak;

    @Column(name = "drift_reduction", nullable = false)
    private int driftReduction;

    @Column(name = "rat_value", nullable = false)
    private double ratValue;

    @Column(name = "node_id", nullable = false, length = 50)
    private String nodeId;

    @Column(name = "protocol_status", nullable = false, length = 100)
    private String protocolStatus;

    @Column(name = "is_escalating", nullable = false)
    private boolean isEscalating;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public TelemetryEntity() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getRecallBalance() {
        return recallBalance;
    }

    public void setRecallBalance(double recallBalance) {
        this.recallBalance = recallBalance;
    }

    public double getPerSecondGain() {
        return perSecondGain;
    }

    public void setPerSecondGain(double perSecondGain) {
        this.perSecondGain = perSecondGain;
    }

    public String getVelocity() {
        return velocity;
    }

    public void setVelocity(String velocity) {
        this.velocity = velocity;
    }

    public String getErrorDriftIndex() {
        return errorDriftIndex;
    }

    public void setErrorDriftIndex(String errorDriftIndex) {
        this.errorDriftIndex = errorDriftIndex;
    }

    public int getDailyFocusFee() {
        return dailyFocusFee;
    }

    public void setDailyFocusFee(int dailyFocusFee) {
        this.dailyFocusFee = dailyFocusFee;
    }

    public int getFocusTax() {
        return focusTax;
    }

    public void setFocusTax(int focusTax) {
        this.focusTax = focusTax;
    }

    public int getDailyModelRamp() {
        return dailyModelRamp;
    }

    public void setDailyModelRamp(int dailyModelRamp) {
        this.dailyModelRamp = dailyModelRamp;
    }

    public int getXpPerMin() {
        return xpPerMin;
    }

    public void setXpPerMin(int xpPerMin) {
        this.xpPerMin = xpPerMin;
    }

    public double getStreak() {
        return streak;
    }

    public void setStreak(double streak) {
        this.streak = streak;
    }

    public int getDriftReduction() {
        return driftReduction;
    }

    public void setDriftReduction(int driftReduction) {
        this.driftReduction = driftReduction;
    }

    public double getRatValue() {
        return ratValue;
    }

    public void setRatValue(double ratValue) {
        this.ratValue = ratValue;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getProtocolStatus() {
        return protocolStatus;
    }

    public void setProtocolStatus(String protocolStatus) {
        this.protocolStatus = protocolStatus;
    }

    public boolean isEscalating() {
        return isEscalating;
    }

    public void setEscalating(boolean escalating) {
        isEscalating = escalating;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
