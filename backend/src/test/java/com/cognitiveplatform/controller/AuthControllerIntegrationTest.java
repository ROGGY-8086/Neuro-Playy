package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.LoginRequest;
import com.cognitiveplatform.dto.RegisterRequest;
import com.cognitiveplatform.entity.User;
import com.cognitiveplatform.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should successfully register a new caregiver with username and return JWT")
    void testRegisterSuccess() throws Exception {
        String uniqueId = String.valueOf(System.currentTimeMillis());
        RegisterRequest request = new RegisterRequest(
                "Clara Barton", "clara_" + uniqueId, "clara_" + uniqueId + "@example.com", "anyPassword123"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.type", is("Bearer")))
                .andExpect(jsonPath("$.user.username", is("clara_" + uniqueId)))
                .andExpect(jsonPath("$.user.email", is("clara_" + uniqueId + "@example.com")))
                .andExpect(jsonPath("$.user.role", is("CAREGIVER")));

        // Verify password is NOT stored as raw plaintext in database
        Optional<User> savedUser = userRepository.findByUsernameNormalized("clara_" + uniqueId);
        assertTrue(savedUser.isPresent());
        assertNotEquals("anyPassword123", savedUser.get().getPasswordHash());
        assertTrue(savedUser.get().getPasswordHash().startsWith("$2"));
    }

    @Test
    @DisplayName("Should reject duplicate username case-insensitively with 409 Conflict")
    void testDuplicateUsernameCaseInsensitive() throws Exception {
        String base = "caregiver_" + System.currentTimeMillis();
        RegisterRequest req1 = new RegisterRequest("User A", base.toLowerCase(), "email1_" + System.currentTimeMillis() + "@example.com", "pass1");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isCreated());

        // Attempt second registration with uppercase username
        RegisterRequest req2 = new RegisterRequest("User B", base.toUpperCase(), "email2_" + System.currentTimeMillis() + "@example.com", "pass2");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.message", containsString("username is already taken")));
    }

    @Test
    @DisplayName("Should reject duplicate email case-insensitively with 409 Conflict")
    void testDuplicateEmailCaseInsensitive() throws Exception {
        String baseEmail = "unique_" + System.currentTimeMillis() + "@example.com";
        RegisterRequest req1 = new RegisterRequest("User One", "user1_" + System.currentTimeMillis(), baseEmail.toLowerCase(), "pass1");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isCreated());

        // Attempt second registration with uppercase email
        RegisterRequest req2 = new RegisterRequest("User Two", "user2_" + System.currentTimeMillis(), baseEmail.toUpperCase(), "pass2");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.message", containsString("email is already registered")));
    }

    @Test
    @DisplayName("Login should succeed with username OR with email")
    void testLoginWithUsernameAndEmail() throws Exception {
        String unique = String.valueOf(System.currentTimeMillis());
        String username = "portaluser_" + unique;
        String email = "portal_" + unique + "@example.com";
        String password = "simplePassword";

        RegisterRequest register = new RegisterRequest("Portal User", username, email, password);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        // 1. Log in with username
        LoginRequest loginWithUsername = new LoginRequest(username, password);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginWithUsername)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.username", is(username)));

        // 2. Log in with email
        LoginRequest loginWithEmail = new LoginRequest(email, password);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginWithEmail)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is(email)));
    }

    @Test
    @DisplayName("Wrong password and unknown user should give IDENTICAL generic error message")
    void testGenericErrorMessageForWrongPasswordAndUnknownUser() throws Exception {
        String genericMsg = "The details you entered don't match. Please try again.";

        // 1. Unknown user
        LoginRequest unknownUser = new LoginRequest("unknown_" + System.currentTimeMillis(), "somePassword");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(unknownUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is(genericMsg)));

        // 2. Registered user with wrong password
        String username = "realuser_" + System.currentTimeMillis();
        String email = username + "@example.com";
        RegisterRequest register = new RegisterRequest("Real User", username, email, "correctPassword");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        LoginRequest wrongPassword = new LoginRequest(username, "incorrectPassword");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongPassword)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is(genericMsg)));
    }

    @Test
    @DisplayName("Logout should invalidate session and subsequent authorized requests fail with 401")
    void testLogoutInvalidatesToken() throws Exception {
        String username = "logoutuser_" + System.currentTimeMillis();
        String email = username + "@example.com";
        RegisterRequest register = new RegisterRequest("Logout User", username, email, "pass123");

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andReturn();

        String token = objectMapper.readTree(regResult.getResponse().getContentAsString()).get("token").asText();
        String authHeader = "Bearer " + token;

        // Verify token works on protected endpoint
        mockMvc.perform(get("/api/profiles")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk());

        // Perform logout
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", containsString("logged out")));

        // Subsequent call with the same token MUST be rejected
        mockMvc.perform(get("/api/profiles")
                        .header("Authorization", authHeader))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Unauthenticated requests to caregiver endpoints must be rejected with 401 Unauthorized")
    void testUnauthenticatedCaregiverEndpointsRejected() throws Exception {
        mockMvc.perform(get("/api/profiles"))
                .andExpect(status().isUnauthorized());
    }
}
