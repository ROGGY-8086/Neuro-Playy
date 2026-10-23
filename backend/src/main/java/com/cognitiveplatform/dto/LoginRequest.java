package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    @Size(max = 150, message = "Identifier must be less than 150 characters")
    private String identifier;

    @NotBlank(message = "Password cannot be empty")
    @Size(max = 128, message = "Password must be less than 128 characters")
    private String password;

    public LoginRequest() {}

    public LoginRequest(String identifier, String password) {
        this.identifier = identifier;
        this.password = password;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    // Backwards-compatibility aliases for existing clients/tests
    public String getEmail() {
        return identifier;
    }

    public void setEmail(String email) {
        this.identifier = email;
    }

    public String getUsernameOrEmail() {
        return identifier;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.identifier = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
