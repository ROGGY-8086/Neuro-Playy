package com.cognitiveplatform.dto;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;

public class GuardianProfileBundleDto {

    @Valid
    private UserProfileDto profile;

    @Valid
    private List<RelativeDto> relatives = new ArrayList<>();

    @Valid
    private List<LifeEventDto> lifeEvents = new ArrayList<>();

    @Valid
    private List<PersonalQuestionDto> customQuestions = new ArrayList<>();

    private boolean setupCompleted;

    public GuardianProfileBundleDto() {}

    public UserProfileDto getProfile() {
        return profile;
    }

    public void setProfile(UserProfileDto profile) {
        this.profile = profile;
    }

    public List<RelativeDto> getRelatives() {
        return relatives;
    }

    public void setRelatives(List<RelativeDto> relatives) {
        this.relatives = relatives != null ? relatives : new ArrayList<>();
    }

    public List<LifeEventDto> getLifeEvents() {
        return lifeEvents;
    }

    public void setLifeEvents(List<LifeEventDto> lifeEvents) {
        this.lifeEvents = lifeEvents != null ? lifeEvents : new ArrayList<>();
    }

    public List<PersonalQuestionDto> getCustomQuestions() {
        return customQuestions;
    }

    public void setCustomQuestions(List<PersonalQuestionDto> customQuestions) {
        this.customQuestions = customQuestions != null ? customQuestions : new ArrayList<>();
    }

    public List<PersonalQuestionDto> getPersonalQuestions() {
        return customQuestions;
    }

    public void setPersonalQuestions(List<PersonalQuestionDto> personalQuestions) {
        setCustomQuestions(personalQuestions);
    }

    public boolean isSetupCompleted() {
        return setupCompleted;
    }

    public void setSetupCompleted(boolean setupCompleted) {
        this.setupCompleted = setupCompleted;
    }
}
