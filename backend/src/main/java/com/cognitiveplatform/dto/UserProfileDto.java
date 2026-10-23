package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UserProfileDto {

    private Long id;
    private Long userId;

    @NotBlank(message = "Full name cannot be empty")
    @Size(max = 150, message = "Full name cannot exceed 150 characters")
    private String fullName;

    @Size(max = 100, message = "Nickname cannot exceed 100 characters")
    private String nickname;

    private LocalDate dateOfBirth;

    @Size(max = 150, message = "Place of birth cannot exceed 150 characters")
    private String placeOfBirth;

    @Size(max = 150, message = "Hometown cannot exceed 150 characters")
    private String hometown;
    private String notes;

    @Size(max = 50, message = "Preferred language cannot exceed 50 characters")
    private String preferredLanguage;

    private boolean setupCompleted;

    public UserProfileDto() {}

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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPlaceOfBirth() {
        return placeOfBirth;
    }

    public void setPlaceOfBirth(String placeOfBirth) {
        this.placeOfBirth = placeOfBirth;
    }

    public String getHometown() {
        return hometown;
    }

    public void setHometown(String hometown) {
        this.hometown = hometown;
    }

    public String getCurrentCity() {
        return hometown;
    }

    public void setCurrentCity(String currentCity) {
        this.hometown = currentCity;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public boolean isSetupCompleted() {
        return setupCompleted;
    }

    public void setSetupCompleted(boolean setupCompleted) {
        this.setupCompleted = setupCompleted;
    }
}
