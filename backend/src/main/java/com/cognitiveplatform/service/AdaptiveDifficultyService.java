package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.DifficultySuggestionResponse;
import com.cognitiveplatform.entity.DifficultyMode;
import com.cognitiveplatform.entity.GameSession;
import com.cognitiveplatform.entity.PlayerProfile;
import com.cognitiveplatform.repository.GameSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
public class AdaptiveDifficultyService {

    private final GameSessionRepository sessionRepository;
    private final OwnershipService ownershipService;

    @Value("${app.difficulty.min-sessions-for-suggestion:5}")
    private int minSessionsForSuggestion;

    @Value("${app.difficulty.high-completion-hint-threshold:2}")
    private int highCompletionHintThreshold;

    @Value("${app.difficulty.low-completion-rate-threshold:0.6}")
    private double lowCompletionRateThreshold;

    private static final Pattern HINTS_PATTERN = Pattern.compile("\"hintsUsed\"\\s*:\\s*(\\d+)");

    public AdaptiveDifficultyService(GameSessionRepository sessionRepository,
                                    OwnershipService ownershipService) {
        this.sessionRepository = sessionRepository;
        this.ownershipService = ownershipService;
    }

    public DifficultySuggestionResponse getDifficultySuggestion(Long profileId, Long caregiverId) {
        PlayerProfile profile = ownershipService.verifyProfileOwnership(profileId, caregiverId);
        String currentLevel = profile.getManualDifficulty() != null ? profile.getManualDifficulty() : "STANDARD";

        // Rule 1: Respect manual override
        if (profile.getDifficultyMode() == DifficultyMode.MANUAL) {
            return new DifficultySuggestionResponse(
                    currentLevel,
                    currentLevel,
                    "Manual preference active. Automatic adjustments are paused to support a familiar, comfortable routine.",
                    0
            );
        }

        // Retrieve the most recent sessions
        List<GameSession> recentSessions = sessionRepository.findTop10ByPlayerIdOrderByStartedAtDesc(profileId);
        int sessionCount = recentSessions.size();

        if (sessionCount < minSessionsForSuggestion) {
            return new DifficultySuggestionResponse(
                    currentLevel,
                    currentLevel,
                    "Currently enjoying initial activity sessions. Gathering more engagement history to offer helpful suggestions.",
                    sessionCount
            );
        }

        // Analyze recent window of sessions
        List<GameSession> evalWindow = recentSessions.subList(0, Math.min(sessionCount, minSessionsForSuggestion));
        long completedCount = evalWindow.stream().filter(GameSession::isCompleted).count();
        double completionRate = (double) completedCount / evalWindow.size();

        int totalHints = 0;
        int hintsRecordedCount = 0;
        for (GameSession s : evalWindow) {
            if (s.getMetricsJson() != null) {
                Matcher matcher = HINTS_PATTERN.matcher(s.getMetricsJson());
                if (matcher.find()) {
                    totalHints += Integer.parseInt(matcher.group(1));
                    hintsRecordedCount++;
                }
            }
        }
        double avgHints = hintsRecordedCount > 0 ? (double) totalHints / hintsRecordedCount : 0.0;

        // Rule 2: High completion with low hints -> Suggest one small step up for gentle variety
        if (completionRate >= 0.8 && avgHints <= highCompletionHintThreshold) {
            String stepUp = stepUpLevel(currentLevel);
            if (!stepUp.equalsIgnoreCase(currentLevel)) {
                return new DifficultySuggestionResponse(
                        currentLevel,
                        stepUp,
                        "Recent activities were completed with ease and confidence. Suggesting one small step up to offer fresh variety.",
                        evalWindow.size()
                );
            }
        }

        // Rule 3: Repeated incompletion or frequent hints -> Suggest one step simpler for calm comfort
        if (completionRate < lowCompletionRateThreshold || avgHints > (highCompletionHintThreshold + 2)) {
            String stepDown = stepDownLevel(currentLevel);
            if (!stepDown.equalsIgnoreCase(currentLevel)) {
                return new DifficultySuggestionResponse(
                        currentLevel,
                        stepDown,
                        "A gentler, more relaxing setting is suggested to ensure daily activities remain calm and enjoyable.",
                        evalWindow.size()
                );
            }
        }

        // Rule 4: Balanced routine -> Keep the same
        return new DifficultySuggestionResponse(
                currentLevel,
                currentLevel,
                "Current activity settings are well-suited, providing a comfortable and supportive experience.",
                evalWindow.size()
        );
    }

    private String stepUpLevel(String current) {
        if ("EASY".equalsIgnoreCase(current) || "GENTLE".equalsIgnoreCase(current)) {
            return "STANDARD";
        } else if ("STANDARD".equalsIgnoreCase(current)) {
            return "CHALLENGING";
        }
        return current;
    }

    private String stepDownLevel(String current) {
        if ("CHALLENGING".equalsIgnoreCase(current) || "ISOMETRIC HARD".equalsIgnoreCase(current)) {
            return "STANDARD";
        } else if ("STANDARD".equalsIgnoreCase(current)) {
            return "GENTLE";
        }
        return current;
    }
}
