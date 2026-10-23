package com.cognitiveplatform.dto;

public class SimulatorStageDto {
    private int step;
    private int maxSteps;
    private String title;
    private String instruction;
    private int targetCount;
    private boolean completed;

    public SimulatorStageDto() {}

    public SimulatorStageDto(int step, int maxSteps, String title, String instruction, int targetCount, boolean completed) {
        this.step = step;
        this.maxSteps = maxSteps;
        this.title = title;
        this.instruction = instruction;
        this.targetCount = targetCount;
        this.completed = completed;
    }

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public int getMaxSteps() {
        return maxSteps;
    }

    public void setMaxSteps(int maxSteps) {
        this.maxSteps = maxSteps;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public int getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(int targetCount) {
        this.targetCount = targetCount;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
