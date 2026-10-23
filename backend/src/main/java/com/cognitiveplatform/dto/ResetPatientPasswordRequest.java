package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPatientPasswordRequest {

    @NotBlank(message = "New password cannot be empty")
    @Size(min = 1, max = 128, message = "Password must be between 1 and 128 characters")
    private String newPassword;

    public ResetPatientPasswordRequest() {}

    public ResetPatientPasswordRequest(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
