package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.DifficultyMode;
import com.cognitiveplatform.entity.ReminderType;
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

import java.time.Instant;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProfileAndDataIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authToken;
    private Long profileId;

    @BeforeEach
    void setUp() throws Exception {
        String unique = String.valueOf(System.currentTimeMillis());
        String email = "caregiver_" + unique + "@example.com";
        RegisterRequest register = new RegisterRequest("Active Caregiver", "caregiver_" + unique, email, "Caregiver123!");

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse auth = objectMapper.readValue(regResult.getResponse().getContentAsString(), AuthResponse.class);
        this.authToken = "Bearer " + auth.getToken();

        CreateProfileRequest profileReq = new CreateProfileRequest();
        profileReq.setPreferredName("Eleanor");
        profileReq.setLanguage("en");
        profileReq.setTextSize("LARGE");
        profileReq.setAudioEnabled(true);
        profileReq.setDifficultyMode(DifficultyMode.AUTO);

        MvcResult profResult = mockMvc.perform(post("/api/profiles")
                        .header("Authorization", authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileReq)))
                .andExpect(status().isCreated())
                .andReturn();

        ProfileResponse profileResp = objectMapper.readValue(profResult.getResponse().getContentAsString(), ProfileResponse.class);
        this.profileId = profileResp.getId();
    }

    @Test
    @DisplayName("Should successfully read and update profile")
    void testProfileCrud() throws Exception {
        mockMvc.perform(get("/api/profiles/" + profileId)
                        .header("Authorization", authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferredName", is("Eleanor")))
                .andExpect(jsonPath("$.textSize", is("LARGE")));

        UpdateProfileRequest update = new UpdateProfileRequest();
        update.setPreferredName("Eleanor Vance");
        update.setAudioEnabled(false);

        mockMvc.perform(put("/api/profiles/" + profileId)
                        .header("Authorization", authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferredName", is("Eleanor Vance")))
                .andExpect(jsonPath("$.audioEnabled", is(false)));
    }

    @Test
    @DisplayName("Should update and retrieve virtual garden state")
    void testGardenSaveAndLoad() throws Exception {
        GardenStateRequest gardenReq = new GardenStateRequest(
                "[{\"id\":\"sunflower-1\",\"stage\":\"blooming\"}]",
                "[{\"id\":\"birdbath-1\",\"x\":40,\"y\":60}]"
        );

        mockMvc.perform(put("/api/profiles/" + profileId + "/garden")
                        .header("Authorization", authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(gardenReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plantsJson", containsString("sunflower-1")));

        mockMvc.perform(get("/api/profiles/" + profileId + "/garden")
                        .header("Authorization", authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plantsJson", containsString("sunflower-1")))
                .andExpect(jsonPath("$.itemsJson", containsString("birdbath-1")));
    }

    @Test
    @DisplayName("Should perform full CRUD on reminders")
    void testRemindersCrud() throws Exception {
        CreateReminderRequest reminderReq = new CreateReminderRequest();
        reminderReq.setTitle("Afternoon Herbal Tea");
        reminderReq.setType(ReminderType.HYDRATION);
        reminderReq.setScheduledAt(Instant.now().plusSeconds(3600));
        reminderReq.setRecurrence("DAILY");
        reminderReq.setEnabled(true);

        MvcResult createResult = mockMvc.perform(post("/api/profiles/" + profileId + "/reminders")
                        .header("Authorization", authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reminderReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Afternoon Herbal Tea")))
                .andReturn();

        ReminderResponse reminder = objectMapper.readValue(createResult.getResponse().getContentAsString(), ReminderResponse.class);

        mockMvc.perform(get("/api/profiles/" + profileId + "/reminders")
                        .header("Authorization", authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Afternoon Herbal Tea")));

        mockMvc.perform(delete("/api/reminders/" + reminder.getId())
                        .header("Authorization", authToken))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/profiles/" + profileId + "/reminders")
                        .header("Authorization", authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @DisplayName("Should log game session, patch completion, and view summary")
    void testGameSessionAndSummary() throws Exception {
        CreateGameSessionRequest sessionReq = new CreateGameSessionRequest();
        sessionReq.setPlayerId(profileId);
        sessionReq.setGameKey("memory-match");
        sessionReq.setDifficulty("STANDARD");
        sessionReq.setCompleted(false);

        MvcResult sessResult = mockMvc.perform(post("/api/games/sessions")
                        .header("Authorization", authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.gameKey", is("memory-match")))
                .andReturn();

        GameSessionResponse session = objectMapper.readValue(sessResult.getResponse().getContentAsString(), GameSessionResponse.class);

        PatchGameSessionRequest patchReq = new PatchGameSessionRequest();
        patchReq.setCompleted(true);
        patchReq.setMetricsJson("{\"pairsMatched\":6,\"hintsUsed\":0}");

        mockMvc.perform(patch("/api/games/sessions/" + session.getId())
                        .header("Authorization", authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(patchReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed", is(true)));

        mockMvc.perform(get("/api/profiles/" + profileId + "/summary")
                        .header("Authorization", authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferredName", is("Eleanor")))
                .andExpect(jsonPath("$.totalSessions", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.activityHistoryNote", notNullValue()));
    }
}
