package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.ConsentResponse;
import com.cognitiveplatform.dto.CreateConsentRequest;
import com.cognitiveplatform.entity.ConsentRecord;
import com.cognitiveplatform.entity.ConsentStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ConsentMapper {

    public ConsentRecord toEntity(CreateConsentRequest request, Long playerId, Long caregiverId) {
        if (request == null) return null;
        ConsentRecord record = new ConsentRecord();
        record.setPlayerId(playerId);
        record.setCaregiverId(caregiverId);
        record.setConsentType(request.getConsentType());
        record.setStatus(request.getStatus() != null ? request.getStatus() : ConsentStatus.GRANTED);
        record.setRecordedAt(Instant.now());
        return record;
    }

    public ConsentResponse toResponse(ConsentRecord entity) {
        if (entity == null) return null;
        ConsentResponse resp = new ConsentResponse();
        resp.setId(entity.getId());
        resp.setPlayerId(entity.getPlayerId());
        resp.setCaregiverId(entity.getCaregiverId());
        resp.setConsentType(entity.getConsentType());
        resp.setStatus(entity.getStatus());
        resp.setRecordedAt(entity.getRecordedAt());
        return resp;
    }
}
