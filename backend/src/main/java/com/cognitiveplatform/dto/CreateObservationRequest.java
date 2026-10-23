package com.cognitiveplatform.dto;

import jakarta.validation.constraints.Size;

public class CreateObservationRequest {

    private Long sessionId;

    @Size(max = 500, message = "Mood note must be less than 500 characters")
    private String moodNote;

    @Size(max = 500, message = "Assistance note must be less than 500 characters")
    private String assistanceNote;

    public CreateObservationRequest() {}

    public CreateObservationRequest(Long sessionId, String moodNote, String assistanceNote) {
        this.sessionId = sessionId;
        this.moodNote = moodNote;
        this.assistanceNote = assistanceNote;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getMoodNote() {
        return moodNote;
    }

    public void setMoodNote(String moodNote) {
        this.moodNote = moodNote;
    }

    public String getAssistanceNote() {
        return assistanceNote;
    }

    public void setAssistanceNote(String assistanceNote) {
        this.assistanceNote = assistanceNote;
    }
}
