package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.ConsentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateConsentRequest {

    @NotBlank(message = "Consent type cannot be empty")
    @Size(max = 100, message = "Consent type must be less than 100 characters")
    private String consentType;

    private ConsentStatus status = ConsentStatus.GRANTED;

    public CreateConsentRequest() {}

    public CreateConsentRequest(String consentType, ConsentStatus status) {
        this.consentType = consentType;
        this.status = status;
    }

    public String getConsentType() {
        return consentType;
    }

    public void setConsentType(String consentType) {
        this.consentType = consentType;
    }

    public ConsentStatus getStatus() {
        return status;
    }

    public void setStatus(ConsentStatus status) {
        this.status = status;
    }
}
