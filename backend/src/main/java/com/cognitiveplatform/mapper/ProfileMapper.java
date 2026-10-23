package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.CreateProfileRequest;
import com.cognitiveplatform.dto.ProfileResponse;
import com.cognitiveplatform.dto.UpdateProfileRequest;
import com.cognitiveplatform.entity.PlayerProfile;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ProfileMapper {

    public PlayerProfile toEntity(CreateProfileRequest request, Long caregiverId) {
        if (request == null) return null;
        PlayerProfile profile = new PlayerProfile();
        profile.setCaregiverId(caregiverId);
        profile.setPreferredName(request.getPreferredName());
        profile.setLanguage(request.getLanguage() != null ? request.getLanguage() : "en");
        profile.setTextSize(request.getTextSize() != null ? request.getTextSize() : "REGULAR");
        profile.setAudioEnabled(request.isAudioEnabled());
        profile.setSupportNotes(request.getSupportNotes());
        profile.setDifficultyMode(request.getDifficultyMode() != null ? request.getDifficultyMode() : com.cognitiveplatform.entity.DifficultyMode.AUTO);
        profile.setManualDifficulty(request.getManualDifficulty() != null ? request.getManualDifficulty() : "STANDARD");
        profile.setCreatedAt(Instant.now());
        return profile;
    }

    public void updateEntity(PlayerProfile entity, UpdateProfileRequest request) {
        if (entity == null || request == null) return;
        if (request.getPreferredName() != null) entity.setPreferredName(request.getPreferredName());
        if (request.getLanguage() != null) entity.setLanguage(request.getLanguage());
        if (request.getTextSize() != null) entity.setTextSize(request.getTextSize());
        if (request.getAudioEnabled() != null) entity.setAudioEnabled(request.getAudioEnabled());
        if (request.getSupportNotes() != null) entity.setSupportNotes(request.getSupportNotes());
        if (request.getDifficultyMode() != null) entity.setDifficultyMode(request.getDifficultyMode());
        if (request.getManualDifficulty() != null) entity.setManualDifficulty(request.getManualDifficulty());
    }

    public ProfileResponse toResponse(PlayerProfile entity) {
        if (entity == null) return null;
        ProfileResponse resp = new ProfileResponse();
        resp.setId(entity.getId());
        resp.setCaregiverId(entity.getCaregiverId());
        resp.setPreferredName(entity.getPreferredName());
        resp.setLanguage(entity.getLanguage());
        resp.setTextSize(entity.getTextSize());
        resp.setAudioEnabled(entity.isAudioEnabled());
        resp.setSupportNotes(entity.getSupportNotes());
        resp.setDifficultyMode(entity.getDifficultyMode());
        resp.setManualDifficulty(entity.getManualDifficulty());
        resp.setCreatedAt(entity.getCreatedAt());
        return resp;
    }
}
