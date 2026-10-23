package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.GameSessionResponse;
import com.cognitiveplatform.dto.ProfileSummaryResponse;
import com.cognitiveplatform.entity.Game;
import com.cognitiveplatform.entity.GameSession;
import com.cognitiveplatform.entity.PlayerProfile;
import com.cognitiveplatform.mapper.SessionMapper;
import com.cognitiveplatform.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final GameSessionRepository sessionRepository;
    private final GameRepository gameRepository;
    private final ReminderRepository reminderRepository;
    private final MemoryItemRepository memoryRepository;
    private final OwnershipService ownershipService;
    private final SessionMapper sessionMapper;

    @Value("${app.difficulty.min-sessions-for-suggestion:5}")
    private int minSessionsForTrend;

    public DashboardService(GameSessionRepository sessionRepository,
                            GameRepository gameRepository,
                            ReminderRepository reminderRepository,
                            MemoryItemRepository memoryRepository,
                            OwnershipService ownershipService,
                            SessionMapper sessionMapper) {
        this.sessionRepository = sessionRepository;
        this.gameRepository = gameRepository;
        this.reminderRepository = reminderRepository;
        this.memoryRepository = memoryRepository;
        this.ownershipService = ownershipService;
        this.sessionMapper = sessionMapper;
    }

    public ProfileSummaryResponse getProfileSummary(Long profileId, Long caregiverId) {
        PlayerProfile profile = ownershipService.verifyProfileOwnership(profileId, caregiverId);

        long totalSessions = sessionRepository.countByPlayerId(profileId);
        List<GameSession> recentSessionsEntities = sessionRepository.findTop10ByPlayerIdOrderByStartedAtDesc(profileId);
        List<GameSessionResponse> recentSessions = recentSessionsEntities.stream()
                .map(sessionMapper::toResponse)
                .collect(Collectors.toList());

        List<Game> enabledGames = gameRepository.findByEnabledTrue();
        Map<String, Long> completionCountByGame = new HashMap<>();
        for (Game game : enabledGames) {
            long count = sessionRepository.countByPlayerIdAndGameKey(profileId, game.getGameKey());
            completionCountByGame.put(game.getGameKey(), count);
        }

        long activeReminders = reminderRepository.countByPlayerIdAndEnabledTrue(profileId);
        long memoryCount = memoryRepository.findAllByPlayerIdOrderBySortOrderAsc(profileId).size();

        String historyNote;
        if (totalSessions >= minSessionsForTrend) {
            historyNote = "Activity history: Consistent participation across preferred cognitive and memory engagement sessions.";
        } else {
            historyNote = "Activity history: Initial activity sessions logged. Continue enjoying daily routines to view patterns.";
        }

        ProfileSummaryResponse response = new ProfileSummaryResponse();
        response.setPlayerId(profileId);
        response.setPreferredName(profile.getPreferredName());
        response.setTotalSessions(totalSessions);
        response.setCompletionCountByGame(completionCountByGame);
        response.setCurrentDifficulty(profile.getManualDifficulty());
        response.setRecentSessions(recentSessions);
        response.setActivityHistoryNote(historyNote);
        response.setActiveRemindersCount(activeReminders);
        response.setMemoriesCount(memoryCount);

        return response;
    }
}
