package com.cognitiveplatform.dto;

public class UserSettingsDto {
    private boolean soundEnabled = true;
    private boolean reducedMotion = false;
    private boolean highContrast = false;
    private String preferredLanguage = "EN";
    private String drillDifficulty = "Standard";

    public UserSettingsDto() {}

    public UserSettingsDto(boolean soundEnabled, boolean reducedMotion, boolean highContrast, String preferredLanguage, String drillDifficulty) {
        this.soundEnabled = soundEnabled;
        this.reducedMotion = reducedMotion;
        this.highContrast = highContrast;
        this.preferredLanguage = preferredLanguage;
        this.drillDifficulty = drillDifficulty;
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
