package com.cognitiveplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 1, max = 100, message = "Username must be between 1 and 100 characters")
    private String username;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must be less than 150 characters")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 1, max = 128, message = "Password must be between 1 and 128 characters")
    private String password;

    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @Size(max = 100, message = "Patient name must be less than 100 characters")
    private String patientName;

    private String patientLanguage;

    private Boolean consentAuthorized;

    public RegisterRequest() {}

    public RegisterRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = username;
    }

    public RegisterRequest(String name, String username, String email, String password) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        if (name != null && !name.isBlank()) {
            return name;
        }
        return username;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientLanguage() {
        return patientLanguage;
    }

    public void setPatientLanguage(String patientLanguage) {
        this.patientLanguage = patientLanguage;
    }

    public Boolean getConsentAuthorized() {
        return consentAuthorized;
    }

    public void setConsentAuthorized(Boolean consentAuthorized) {
        this.consentAuthorized = consentAuthorized;
    }
}
