package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.RadarAgentDto;
import com.cognitiveplatform.dto.TelemetryDto;
import com.cognitiveplatform.dto.UserSettingsDto;
import com.cognitiveplatform.entity.RadarAgentEntity;
import com.cognitiveplatform.entity.TelemetryEntity;
import com.cognitiveplatform.entity.UserSettingsEntity;
import org.springframework.stereotype.Component;

@Component
public class CompanionMapper {

    public TelemetryDto toDto(TelemetryEntity entity) {
        if (entity == null) return null;
        TelemetryDto dto = new TelemetryDto();
        dto.setRecallBalance(entity.getRecallBalance());
        dto.setPerSecondGain(entity.getPerSecondGain());
        dto.setVelocity(entity.getVelocity());
        dto.setErrorDriftIndex(entity.getErrorDriftIndex());
        dto.setDailyFocusFee(entity.getDailyFocusFee());
        dto.setFocusTax(entity.getFocusTax());
        dto.setDailyModelRamp(entity.getDailyModelRamp());
        dto.setXpPerMin(entity.getXpPerMin());
        dto.setStreak(entity.getStreak());
        dto.setDriftReduction(entity.getDriftReduction());
        dto.setRatValue(entity.getRatValue());
        dto.setNodeId(entity.getNodeId());
        dto.setProtocolStatus(entity.getProtocolStatus());
        dto.setEscalating(entity.isEscalating());
        return dto;
    }

    public void updateEntity(TelemetryEntity entity, TelemetryDto dto) {
        if (entity == null || dto == null) return;
        if (dto.getRecallBalance() > 0) entity.setRecallBalance(dto.getRecallBalance());
        if (dto.getPerSecondGain() > 0) entity.setPerSecondGain(dto.getPerSecondGain());
        if (dto.getVelocity() != null) entity.setVelocity(dto.getVelocity());
        if (dto.getErrorDriftIndex() != null) entity.setErrorDriftIndex(dto.getErrorDriftIndex());
        if (dto.getDailyFocusFee() > 0) entity.setDailyFocusFee(dto.getDailyFocusFee());
        if (dto.getFocusTax() > 0) entity.setFocusTax(dto.getFocusTax());
        if (dto.getDailyModelRamp() > 0) entity.setDailyModelRamp(dto.getDailyModelRamp());
        if (dto.getXpPerMin() > 0) entity.setXpPerMin(dto.getXpPerMin());
        if (dto.getStreak() > 0) entity.setStreak(dto.getStreak());
        if (dto.getDriftReduction() > 0) entity.setDriftReduction(dto.getDriftReduction());
        if (dto.getRatValue() > 0) entity.setRatValue(dto.getRatValue());
        if (dto.getNodeId() != null) entity.setNodeId(dto.getNodeId());
        if (dto.getProtocolStatus() != null) entity.setProtocolStatus(dto.getProtocolStatus());
        entity.setEscalating(dto.isEscalating());
        entity.setUpdatedAt(java.time.Instant.now());
    }

    public RadarAgentDto toDto(RadarAgentEntity entity) {
        if (entity == null) return null;
        return new RadarAgentDto(
                entity.getId(),
                entity.getLabel(),
                entity.getX(),
                entity.getY(),
                entity.getStatus(),
                entity.getSpeech(),
                entity.getDecayTime()
        );
    }

    public UserSettingsDto toDto(UserSettingsEntity entity) {
        if (entity == null) return new UserSettingsDto();
        return new UserSettingsDto(
                entity.isSoundEnabled(),
                entity.isReducedMotion(),
                entity.isHighContrast(),
                entity.getPreferredLanguage(),
                entity.getDrillDifficulty()
        );
    }

    public void updateEntity(UserSettingsEntity entity, UserSettingsDto dto) {
        if (entity == null || dto == null) return;
        entity.setSoundEnabled(dto.isSoundEnabled());
        entity.setReducedMotion(dto.isReducedMotion());
        entity.setHighContrast(dto.isHighContrast());
        if (dto.getPreferredLanguage() != null) entity.setPreferredLanguage(dto.getPreferredLanguage());
        if (dto.getDrillDifficulty() != null) entity.setDrillDifficulty(dto.getDrillDifficulty());
    }
}
