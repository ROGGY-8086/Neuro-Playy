package com.cognitiveplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PatientRegisterRequest {

    @NotBlank(message = "Your name cannot be empty")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 1, max = 100, message = "Username must be between 1 and 100 characters")
    private String username;

    @Email(message = "Please provide a valid email address")
    @Size(max = 150, message = "Email must be less than 150 characters")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 1, max = 128, message = "Password must be between 1 and 128 characters")
    private String password;

    @NotBlank(message = "Caregiver link code cannot be empty")
    @Size(min = 4, max = 32, message = "Link code must be valid")
    private String linkCode;

    public PatientRegisterRequest() {}

    public PatientRegisterRequest(String name, String username, String email, String password, String linkCode) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.linkCode = linkCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getLinkCode() {
        return linkCode;
    }

    public void setLinkCode(String linkCode) {
        this.linkCode = linkCode;
    }
}
