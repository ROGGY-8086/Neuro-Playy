package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.DifficultyMode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CrossCaregiverAuthorizationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenA;
    private String tokenB;
    private Long profileAId;

    @BeforeEach
    void setUp() throws Exception {
        // Register Caregiver A
        String uniqueA = String.valueOf(System.currentTimeMillis());
        String emailA = "caregiverA_" + uniqueA + "@example.com";
        MvcResult regA = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("Caregiver A", "caregiverA_" + uniqueA, emailA, "PasswordA123!"))))
                .andExpect(status().isCreated())
                .andReturn();
        AuthResponse authA = objectMapper.readValue(regA.getResponse().getContentAsString(), AuthResponse.class);
        this.tokenA = "Bearer " + authA.getToken();

        // Create Profile for Caregiver A
        CreateProfileRequest profileReqA = new CreateProfileRequest();
        profileReqA.setPreferredName("Alice");
        profileReqA.setDifficultyMode(DifficultyMode.AUTO);
        MvcResult profA = mockMvc.perform(post("/api/profiles")
                        .header("Authorization", tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileReqA)))
                .andExpect(status().isCreated())
                .andReturn();
        ProfileResponse respA = objectMapper.readValue(profA.getResponse().getContentAsString(), ProfileResponse.class);
        this.profileAId = respA.getId();

        // Register Caregiver B
        String uniqueB = String.valueOf(System.currentTimeMillis() + 100);
        String emailB = "caregiverB_" + uniqueB + "@example.com";
        MvcResult regB = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterRequest("Caregiver B", "caregiverB_" + uniqueB, emailB, "PasswordB123!"))))
                .andExpect(status().isCreated())
                .andReturn();
        AuthResponse authB = objectMapper.readValue(regB.getResponse().getContentAsString(), AuthResponse.class);
        this.tokenB = "Bearer " + authB.getToken();
    }

    @Test
    @DisplayName("Caregiver B CANNOT read Caregiver A's profile")
    void testCannotReadOtherCaregiversProfile() throws Exception {
        mockMvc.perform(get("/api/profiles/" + profileAId)
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Caregiver B CANNOT update Caregiver A's profile")
    void testCannotUpdateOtherCaregiversProfile() throws Exception {
        UpdateProfileRequest update = new UpdateProfileRequest();
        update.setPreferredName("Tampered Name");

        mockMvc.perform(put("/api/profiles/" + profileAId)
                        .header("Authorization", tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Caregiver B CANNOT delete Caregiver A's profile")
    void testCannotDeleteOtherCaregiversProfile() throws Exception {
        mockMvc.perform(delete("/api/profiles/" + profileAId)
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Caregiver B CANNOT view or modify Caregiver A's memories")
    void testCannotAccessOtherCaregiversMemories() throws Exception {
        mockMvc.perform(get("/api/profiles/" + profileAId + "/memories")
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());

        CreateMemoryRequest memoryReq = new CreateMemoryRequest(
                com.cognitiveplatform.entity.MemoryType.STORY, "Injected", "Hacked", null, 1
        );
        mockMvc.perform(post("/api/profiles/" + profileAId + "/memories")
                        .header("Authorization", tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(memoryReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Caregiver B CANNOT view Caregiver A's garden, reminders, observations, or summary")
    void testCannotAccessOtherCaregiversGardenOrReminders() throws Exception {
        // Garden
        mockMvc.perform(get("/api/profiles/" + profileAId + "/garden")
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());

        // Reminders
        mockMvc.perform(get("/api/profiles/" + profileAId + "/reminders")
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());

        // Observations
        mockMvc.perform(get("/api/profiles/" + profileAId + "/observations")
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());

        // Sessions
        mockMvc.perform(get("/api/profiles/" + profileAId + "/sessions")
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());

        // Difficulty suggestion
        mockMvc.perform(get("/api/profiles/" + profileAId + "/difficulty-suggestion")
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());

        // Dashboard summary
        mockMvc.perform(get("/api/profiles/" + profileAId + "/summary")
                        .header("Authorization", tokenB))
                .andExpect(status().isForbidden());
    }
}
