package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.DifficultySuggestionResponse;
import com.cognitiveplatform.entity.DifficultyMode;
import com.cognitiveplatform.entity.GameSession;
import com.cognitiveplatform.entity.PlayerProfile;
import com.cognitiveplatform.repository.GameSessionRepository;
import com.cognitiveplatform.repository.PlayerProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdaptiveDifficultyServiceTest {

    @Mock
    private GameSessionRepository sessionRepository;

    @Mock
    private PlayerProfileRepository profileRepository;

    private OwnershipService ownershipService;
    private AdaptiveDifficultyService difficultyService;

    @BeforeEach
    void setUp() {
        ownershipService = new OwnershipService(profileRepository, null, null, null);
        difficultyService = new AdaptiveDifficultyService(sessionRepository, ownershipService);

        ReflectionTestUtils.setField(difficultyService, "minSessionsForSuggestion", 5);
        ReflectionTestUtils.setField(difficultyService, "highCompletionHintThreshold", 2);
        ReflectionTestUtils.setField(difficultyService, "lowCompletionRateThreshold", 0.6);
    }

    @Test
    @DisplayName("Should never alter level when difficultyMode is MANUAL")
    void testManualDifficultyOverride() {
        PlayerProfile profile = new PlayerProfile();
        profile.setId(10L);
        profile.setCaregiverId(1L);
        profile.setDifficultyMode(DifficultyMode.MANUAL);
        profile.setManualDifficulty("GENTLE");

        when(profileRepository.findById(10L)).thenReturn(Optional.of(profile));

        DifficultySuggestionResponse response = difficultyService.getDifficultySuggestion(10L, 1L);

        assertEquals("GENTLE", response.getCurrentLevel());
        assertEquals("GENTLE", response.getSuggestedLevel());
        assertTrue(response.getReason().contains("Manual preference active"));
        assertEquals(0, response.getBasedOnSessions());
    }

    @Test
    @DisplayName("Should gather baseline when sessions count is less than threshold")
    void testGatheringBaselineWhenFewSessions() {
        PlayerProfile profile = new PlayerProfile();
        profile.setId(10L);
        profile.setCaregiverId(1L);
        profile.setDifficultyMode(DifficultyMode.AUTO);
        profile.setManualDifficulty("STANDARD");

        when(profileRepository.findById(10L)).thenReturn(Optional.of(profile));
        when(sessionRepository.findTop10ByPlayerIdOrderByStartedAtDesc(10L))
                .thenReturn(Collections.singletonList(new GameSession()));

        DifficultySuggestionResponse response = difficultyService.getDifficultySuggestion(10L, 1L);

        assertEquals("STANDARD", response.getCurrentLevel());
        assertEquals("STANDARD", response.getSuggestedLevel());
        assertTrue(response.getReason().contains("initial activity sessions"));
        assertEquals(1, response.getBasedOnSessions());
    }

    @Test
    @DisplayName("Should suggest step up when high completion rate with low hints")
    void testStepUpWhenConsistentlyMastered() {
        PlayerProfile profile = new PlayerProfile();
        profile.setId(10L);
        profile.setCaregiverId(1L);
        profile.setDifficultyMode(DifficultyMode.AUTO);
        profile.setManualDifficulty("STANDARD");

        List<GameSession> sessions = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            GameSession s = new GameSession();
            s.setCompleted(true);
            s.setStartedAt(Instant.now());
            s.setMetricsJson("{\"pairsMatched\":6,\"hintsUsed\":0}");
            sessions.add(s);
        }

        when(profileRepository.findById(10L)).thenReturn(Optional.of(profile));
        when(sessionRepository.findTop10ByPlayerIdOrderByStartedAtDesc(10L)).thenReturn(sessions);

        DifficultySuggestionResponse response = difficultyService.getDifficultySuggestion(10L, 1L);

        assertEquals("STANDARD", response.getCurrentLevel());
        assertEquals("CHALLENGING", response.getSuggestedLevel());
        assertTrue(response.getReason().contains("fresh variety"));
        assertEquals(5, response.getBasedOnSessions());
    }

    @Test
    @DisplayName("Should suggest gentler step when frequent hints or incompletion")
    void testStepDownWhenAssistanceNeeded() {
        PlayerProfile profile = new PlayerProfile();
        profile.setId(10L);
        profile.setCaregiverId(1L);
        profile.setDifficultyMode(DifficultyMode.AUTO);
        profile.setManualDifficulty("STANDARD");

        List<GameSession> sessions = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            GameSession s = new GameSession();
            s.setCompleted(false); // Incomplete
            s.setStartedAt(Instant.now());
            s.setMetricsJson("{\"pairsMatched\":2,\"hintsUsed\":5}");
            sessions.add(s);
        }

        when(profileRepository.findById(10L)).thenReturn(Optional.of(profile));
        when(sessionRepository.findTop10ByPlayerIdOrderByStartedAtDesc(10L)).thenReturn(sessions);

        DifficultySuggestionResponse response = difficultyService.getDifficultySuggestion(10L, 1L);

        assertEquals("STANDARD", response.getCurrentLevel());
        assertEquals("GENTLE", response.getSuggestedLevel());
        assertTrue(response.getReason().contains("gentler, more relaxing setting"));
        assertEquals(5, response.getBasedOnSessions());
    }
}
