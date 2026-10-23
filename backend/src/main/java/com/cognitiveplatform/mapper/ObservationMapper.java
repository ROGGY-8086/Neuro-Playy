package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.CreateObservationRequest;
import com.cognitiveplatform.dto.ObservationResponse;
import com.cognitiveplatform.entity.CaregiverObservation;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ObservationMapper {

    public CaregiverObservation toEntity(CreateObservationRequest request, Long playerId, Long creatorId) {
        if (request == null) return null;
        CaregiverObservation obs = new CaregiverObservation();
        obs.setPlayerId(playerId);
        obs.setSessionId(request.getSessionId());
        obs.setMoodNote(request.getMoodNote());
        obs.setAssistanceNote(request.getAssistanceNote());
        obs.setCreatedBy(creatorId);
        obs.setCreatedAt(Instant.now());
        return obs;
    }

    public ObservationResponse toResponse(CaregiverObservation entity) {
        if (entity == null) return null;
        ObservationResponse resp = new ObservationResponse();
        resp.setId(entity.getId());
        resp.setPlayerId(entity.getPlayerId());
        resp.setSessionId(entity.getSessionId());
        resp.setMoodNote(entity.getMoodNote());
        resp.setAssistanceNote(entity.getAssistanceNote());
        resp.setCreatedBy(entity.getCreatedBy());
        resp.setCreatedAt(entity.getCreatedAt());
        return resp;
    }
}
