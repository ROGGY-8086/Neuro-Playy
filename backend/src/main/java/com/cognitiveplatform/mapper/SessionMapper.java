package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.CreateGameSessionRequest;
import com.cognitiveplatform.dto.GameSessionResponse;
import com.cognitiveplatform.dto.PatchGameSessionRequest;
import com.cognitiveplatform.entity.GameSession;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class SessionMapper {

    public GameSession toEntity(CreateGameSessionRequest request, Long playerId) {
        if (request == null) return null;
        GameSession session = new GameSession();
        session.setPlayerId(playerId);
        session.setGameKey(request.getGameKey() != null ? request.getGameKey() : "memory-match");
        session.setDifficulty(request.getDifficulty() != null ? request.getDifficulty() : "STANDARD");
        session.setCompleted(request.isCompleted());
        session.setStartedAt(Instant.now());

        if (request.getMetricsJson() != null && !request.getMetricsJson().isBlank()) {
            session.setMetricsJson(request.getMetricsJson());
        } else if (request.getScore() != null || request.getAccuracy() != null || request.getDurationSeconds() != null) {
            StringBuilder sb = new StringBuilder("{");
            boolean first = true;
            if (request.getScore() != null) {
                sb.append("\"engagementPoints\":").append(request.getScore());
                first = false;
            }
            if (request.getAccuracy() != null) {
                if (!first) sb.append(",");
                sb.append("\"accuracy\":").append(request.getAccuracy());
                first = false;
            }
            if (request.getDurationSeconds() != null) {
                if (!first) sb.append(",");
                sb.append("\"durationSeconds\":").append(request.getDurationSeconds());
            }
            sb.append("}");
            session.setMetricsJson(sb.toString());
        }

        if (request.isCompleted()) {
            session.setEndedAt(Instant.now());
        }
        return session;
    }

    public void patchEntity(GameSession session, PatchGameSessionRequest request) {
        if (session == null || request == null) return;
        if (request.getCompleted() != null) {
            session.setCompleted(request.getCompleted());
            if (request.getCompleted() && session.getEndedAt() == null) {
                session.setEndedAt(request.getEndedAt() != null ? request.getEndedAt() : Instant.now());
            }
        }
        if (request.getEndedAt() != null) {
            session.setEndedAt(request.getEndedAt());
        }
        if (request.getMetricsJson() != null) {
            session.setMetricsJson(request.getMetricsJson());
        }
    }

    public GameSessionResponse toResponse(GameSession session) {
        if (session == null) return null;
        GameSessionResponse resp = new GameSessionResponse();
        resp.setId(session.getId());
        resp.setSessionId(session.getId() != null ? session.getId().toString() : null);
        resp.setPlayerId(session.getPlayerId());
        resp.setGameKey(session.getGameKey());
        resp.setStartedAt(session.getStartedAt());
        resp.setEndedAt(session.getEndedAt());
        resp.setDifficulty(session.getDifficulty());
        resp.setCompleted(session.isCompleted());
        resp.setMetricsJson(session.getMetricsJson());
        resp.setStatus("synced_to_platform");
        return resp;
    }
}
