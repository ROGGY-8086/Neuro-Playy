package com.cognitiveplatform.dto;

public class TelemetryDto {
    private double recallBalance;
    private double perSecondGain;
    private String velocity;
    private String errorDriftIndex;
    private int dailyFocusFee;
    private int focusTax;
    private int dailyModelRamp;
    private int xpPerMin;
    private double streak;
    private int driftReduction;
    private double ratValue;
    private String nodeId;
    private String protocolStatus;
    private boolean isEscalating;

    public TelemetryDto() {}

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
}
