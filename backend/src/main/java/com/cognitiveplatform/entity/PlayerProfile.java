package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "player_profiles")
public class PlayerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "caregiver_id", nullable = false)
    private Long caregiverId;

    @Column(name = "preferred_name", nullable = false, length = 100)
    private String preferredName;

    @Column(nullable = false, length = 10)
    private String language = "en";

    @Column(name = "text_size", nullable = false, length = 20)
    private String textSize = "REGULAR";

    @Column(name = "audio_enabled", nullable = false)
    private boolean audioEnabled = true;

    @Column(name = "support_notes", columnDefinition = "TEXT")
    private String supportNotes;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_mode", nullable = false, length = 20)
    private DifficultyMode difficultyMode = DifficultyMode.AUTO;

    @Column(name = "manual_difficulty", nullable = false, length = 30)
    private String manualDifficulty = "STANDARD";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public PlayerProfile() {}

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
