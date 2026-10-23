package com.cognitiveplatform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSettingsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "sound_enabled", nullable = false)
    private boolean soundEnabled = true;

    @Column(name = "reduced_motion", nullable = false)
    private boolean reducedMotion = false;

    @Column(name = "high_contrast", nullable = false)
    private boolean highContrast = false;

    @Column(name = "preferred_language", nullable = false, length = 10)
    private String preferredLanguage = "EN";

    @Column(name = "drill_difficulty", nullable = false, length = 30)
    private String drillDifficulty = "Standard";

    public UserSettingsEntity() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public boolean isSoundEnabled() {
        return soundEnabled;
    }

    public void setSoundEnabled(boolean soundEnabled) {
        this.soundEnabled = soundEnabled;
    }

    public boolean isReducedMotion() {
        return reducedMotion;
    }

    public void setReducedMotion(boolean reducedMotion) {
        this.reducedMotion = reducedMotion;
    }

    public boolean isHighContrast() {
        return highContrast;
    }

    public void setHighContrast(boolean highContrast) {
        this.highContrast = highContrast;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public String getDrillDifficulty() {
        return drillDifficulty;
    }

    public void setDrillDifficulty(String drillDifficulty) {
        this.drillDifficulty = drillDifficulty;
    }
}
