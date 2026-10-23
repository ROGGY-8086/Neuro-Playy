package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.CreateGameSessionRequest;
import com.cognitiveplatform.dto.GameSessionResponse;
import com.cognitiveplatform.dto.PatchGameSessionRequest;
import com.cognitiveplatform.entity.GameSession;
import com.cognitiveplatform.entity.PlayerProfile;
import com.cognitiveplatform.exception.BadRequestException;
import com.cognitiveplatform.exception.ResourceNotFoundException;
import com.cognitiveplatform.mapper.SessionMapper;
import com.cognitiveplatform.repository.GameSessionRepository;
import com.cognitiveplatform.repository.PlayerProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class GameSessionService {

    private final GameSessionRepository sessionRepository;
    private final PlayerProfileRepository profileRepository;
    private final OwnershipService ownershipService;
    private final SessionMapper sessionMapper;

    public GameSessionService(GameSessionRepository sessionRepository,
                              PlayerProfileRepository profileRepository,
                              OwnershipService ownershipService,
                              SessionMapper sessionMapper) {
        this.sessionRepository = sessionRepository;
        this.profileRepository = profileRepository;
        this.ownershipService = ownershipService;
        this.sessionMapper = sessionMapper;
    }

    public GameSessionResponse createSession(CreateGameSessionRequest request, Long caregiverId) {
        Long playerId = request.getPlayerId();

        if (playerId == null) {
            if (caregiverId != null) {
                List<PlayerProfile> profiles = profileRepository.findAllByCaregiverId(caregiverId);
                if (!profiles.isEmpty()) {
                    playerId = profiles.get(0).getId();
                }
            }
            if (playerId == null) {
                playerId = 1L; // fallback demo profile
            }
        } else if (caregiverId != null) {
            ownershipService.verifyProfileOwnership(playerId, caregiverId);
        }

        GameSession session = sessionMapper.toEntity(request, playerId);
        GameSession saved = sessionRepository.save(session);
        return sessionMapper.toResponse(saved);
    }

    public GameSessionResponse patchSession(Long sessionId, PatchGameSessionRequest request, Long caregiverId) {
        GameSession session;
        if (caregiverId != null) {
            session = ownershipService.verifySessionOwnership(sessionId, caregiverId);
        } else {
            session = sessionRepository.findById(sessionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Game session not found with ID: " + sessionId));
        }

        sessionMapper.patchEntity(session, request);
        GameSession updated = sessionRepository.save(session);
        return sessionMapper.toResponse(updated);
    }

    @Transactional(readOnly = true)
    public GameSessionResponse getSession(Long sessionId) {
        GameSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Game session not found with ID: " + sessionId));
        return sessionMapper.toResponse(session);
    }

    @Transactional(readOnly = true)
    public Page<GameSessionResponse> getSessions(Long profileId, String gameKey, Instant from, Instant to,
                                                Pageable pageable, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        Page<GameSession> sessions = sessionRepository.findFiltered(profileId, gameKey, from, to, pageable);
        return sessions.map(sessionMapper::toResponse);
    }
}
