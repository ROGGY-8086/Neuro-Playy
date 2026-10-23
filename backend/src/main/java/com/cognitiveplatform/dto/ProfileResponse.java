package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.DifficultyMode;
import java.time.Instant;

public class ProfileResponse {
    private Long id;
    private Long caregiverId;
    private String preferredName;
    private String language;
    private String textSize;
    private boolean audioEnabled;
    private String supportNotes;
    private DifficultyMode difficultyMode;
    private String manualDifficulty;
    private Instant createdAt;

    public ProfileResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCaregiverId() {
        return caregiverId;
    }

    public void setCaregiverId(Long caregiverId) {
        this.caregiverId = caregiverId;
    }

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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
