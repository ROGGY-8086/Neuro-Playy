package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.repository.DailyScoreRepository;
import com.cognitiveplatform.repository.UserRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class DailyMemoryGameIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DailyScoreRepository scoreRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Long userId;
    private String userToken;

    @BeforeEach
    void setUp() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setName("Robert Miller");
        req.setUsername("robert_miller");
        req.setEmail("robert.miller@example.com");
        req.setPassword("RobertPass123!");
        req.setConsentAuthorized(true);

        MvcResult regRes = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        String resStr = regRes.getResponse().getContentAsString();
        userToken = objectMapper.readTree(resStr).get("token").asText();
        userId = objectMapper.readTree(resStr).get("user").get("id").asLong();
    }

    @Test
    @DisplayName("Complete end-to-end flow: Guardian Profile Setup -> Generate Daily Questions -> Play & Score -> History")
    void testGuardianProfileAndDailyGameLifecycle() throws Exception {
        // 1. Initially check setup status -> should be false
        mockMvc.perform(get("/api/guardian-profile/status")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.setupCompleted").value(false));

        // 2. Save complete Guardian Profile bundle
        GuardianProfileBundleDto bundle = new GuardianProfileBundleDto();

        UserProfileDto profileDto = new UserProfileDto();
        profileDto.setFullName("Robert Miller");
        profileDto.setNickname("Bobby");
        profileDto.setDateOfBirth(LocalDate.of(1952, 3, 12));
        profileDto.setPlaceOfBirth("Pune");
        profileDto.setHometown("Mumbai");
        profileDto.setPreferredLanguage("en");
        bundle.setProfile(profileDto);

        RelativeDto r1 = new RelativeDto(null, "Sarah Miller", "Spouse", LocalDate.of(1955, 6, 25), "Married 45 years");
        RelativeDto r2 = new RelativeDto(null, "David Miller", "Son", LocalDate.of(1980, 9, 8), "Lives in Bangalore");
        bundle.setRelatives(List.of(r1, r2));

        LifeEventDto e1 = new LifeEventDto();
        e1.setEventTitle("Family Trip to Goa");
        e1.setEventPlace("Goa");
        e1.setApproximateYear(1995);
        e1.setEventDescription("Spent a week by the beach watching sunsets");
        bundle.setLifeEvents(List.of(e1));

        PersonalQuestionDto q1 = new PersonalQuestionDto();
        q1.setQuestionText("What was your favorite classic car?");
        q1.setCorrectAnswer("1968 Ford Mustang");
        q1.setAlternativeAnswers("Chevrolet Camaro, Dodge Charger, Volkswagen Beetle");
        q1.setCategory("Personal");
        bundle.setCustomQuestions(List.of(q1));

        mockMvc.perform(put("/api/guardian-profile")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bundle)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.setupCompleted").value(true))
                .andExpect(jsonPath("$.profile.fullName").value("Robert Miller"))
                .andExpect(jsonPath("$.relatives.length()").value(2))
                .andExpect(jsonPath("$.lifeEvents.length()").value(1))
                .andExpect(jsonPath("$.customQuestions.length()").value(1));

        // 3. Verify setup status now returns true
        mockMvc.perform(get("/api/guardian-profile/status")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.setupCompleted").value(true));

        // 4. Check Daily Game status -> hasCompletedToday should be false, hasProfileData should be true
        mockMvc.perform(get("/api/daily-game/status")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasCompletedToday").value(false))
                .andExpect(jsonPath("$.hasProfileData").value(true));

        // 5. Start Daily Game Session
        MvcResult startResult = mockMvc.perform(post("/api/daily-game/start")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionId").isNumber())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
                .andExpect(jsonPath("$.questions.length()").value(5))
                .andReturn();

        DailyGameSessionDto sessionDto = objectMapper.readValue(
                startResult.getResponse().getContentAsString(),
                DailyGameSessionDto.class
        );
        assertThat(sessionDto.getQuestions()).hasSize(5);

        // Verify each question has 4 distinct options and no duplicate options
        for (ClientQuestionDto q : sessionDto.getQuestions()) {
            assertThat(q.getOptions()).hasSize(4);
            assertThat(q.getOptions().stream().distinct().count()).isEqualTo(4);
        }

        // 6. Test session idempotency: calling start again should return the exact same session (resume)
        mockMvc.perform(post("/api/daily-game/start")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionId").value(sessionDto.getSessionId()));

        // 7. Complete the game on the server
        MvcResult completeResult = mockMvc.perform(post("/api/daily-game/complete")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").isNumber())
                .andExpect(jsonPath("$.totalQuestions").value(5))
                .andExpect(jsonPath("$.newlyCredited").value(true))
                .andReturn();

        DailyGameResultDto resultDto = objectMapper.readValue(
                completeResult.getResponse().getContentAsString(),
                DailyGameResultDto.class
        );
        assertThat(resultDto.getScore()).isBetween(0, 5);

        // 8. Prevent duplicate credited attempt: calling complete again should return newlyCredited = false
        mockMvc.perform(post("/api/daily-game/complete")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.newlyCredited").value(false))
                .andExpect(jsonPath("$.score").value(resultDto.getScore()));

        // 9. Verify daily_scores table in database has exactly one minimal record
        assertThat(scoreRepository.countByUserId(userId)).isEqualTo(1);

        // 10. Check Daily Game Status now shows hasCompletedToday = true with todayScore
        mockMvc.perform(get("/api/daily-game/status")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hasCompletedToday").value(true))
                .andExpect(jsonPath("$.todayScore").value(resultDto.getScore()));

        // 11. Fetch Score History and verify derived statistics
        mockMvc.perform(get("/api/daily-game/scores")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.history.length()").value(1))
                .andExpect(jsonPath("$.history[0].score").value(resultDto.getScore()))
                .andExpect(jsonPath("$.statistics.totalGamesPlayed").value(1))
                .andExpect(jsonPath("$.statistics.bestScore").value(resultDto.getScore()));
    }
}
