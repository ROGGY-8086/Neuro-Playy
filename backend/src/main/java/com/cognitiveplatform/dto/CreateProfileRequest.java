package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.DifficultyMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateProfileRequest {

    @NotBlank(message = "Preferred name cannot be empty")
    @Size(max = 100, message = "Preferred name must be less than 100 characters")
    private String preferredName;

    private String language = "en";
    private String textSize = "REGULAR";
    private boolean audioEnabled = true;
    private String supportNotes;
    private DifficultyMode difficultyMode = DifficultyMode.AUTO;
    private String manualDifficulty = "STANDARD";

    public CreateProfileRequest() {}

    public String getPreferredName() {
        return preferredName;
    }

    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTextSize() {
        return textSize;
    }

    public void setTextSize(String textSize) {
        this.textSize = textSize;
    }

    public boolean isAudioEnabled() {
        return audioEnabled;
    }

    public void setAudioEnabled(boolean audioEnabled) {
        this.audioEnabled = audioEnabled;
    }

    public String getSupportNotes() {
        return supportNotes;
    }

    public void setSupportNotes(String supportNotes) {
        this.supportNotes = supportNotes;
    }

    public DifficultyMode getDifficultyMode() {
        return difficultyMode;
    }

    public void setDifficultyMode(DifficultyMode difficultyMode) {
        this.difficultyMode = difficultyMode;
    }

    public String getManualDifficulty() {
        return manualDifficulty;
    }

    public void setManualDifficulty(String manualDifficulty) {
        this.manualDifficulty = manualDifficulty;
    }
}
