package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.AuthResponse;
import com.cognitiveplatform.dto.LoginRequest;
import com.cognitiveplatform.dto.PatientRegisterRequest;
import com.cognitiveplatform.dto.RegisterRequest;
import com.cognitiveplatform.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Caregiver and Patient registration, login, and session logout")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new caregiver account and optionally set up patient profile")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/patient/register")
    @Operation(summary = "Register a new patient account using a caregiver link code")
    public ResponseEntity<AuthResponse> registerPatient(@Valid @RequestBody PatientRegisterRequest request) {
        AuthResponse response = authService.registerPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Log in using username or email with password for either caregiver or patient")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out and invalidate current JWT session")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of("message", "Session successfully logged out"));
    }
}
