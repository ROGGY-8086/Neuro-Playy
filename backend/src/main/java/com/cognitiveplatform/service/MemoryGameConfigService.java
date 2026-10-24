package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.MemoryGameConfigDto;
import com.cognitiveplatform.dto.MemoryGameQuestionDto;
import com.cognitiveplatform.entity.DifficultyMode;
import com.cognitiveplatform.entity.MemoryGameQuestion;
import com.cognitiveplatform.entity.PlayerProfile;
import com.cognitiveplatform.exception.BadRequestException;
import com.cognitiveplatform.repository.MemoryGameQuestionRepository;
import com.cognitiveplatform.repository.PlayerProfileRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemoryGameConfigService {

    public static final int REQUIRED_QUESTION_COUNT = 5;

    private final MemoryGameQuestionRepository questionRepository;
    private final PlayerProfileRepository playerProfileRepository;
    private final OwnershipService ownershipService;
    private final ObjectMapper objectMapper;

    public MemoryGameConfigService(MemoryGameQuestionRepository questionRepository,
                                   PlayerProfileRepository playerProfileRepository,
                                   OwnershipService ownershipService,
                                   ObjectMapper objectMapper) {
        this.questionRepository = questionRepository;
        this.playerProfileRepository = playerProfileRepository;
        this.ownershipService = ownershipService;
        this.objectMapper = objectMapper;
    }

    /**
     * Resolves the target patient profile for the caregiver.
     * Uses the given profileId if it belongs to the caregiver;
     * otherwise automatically falls back to the caregiver's own patient profile.
     */
    @Transactional
    public PlayerProfile resolveTargetProfile(Long profileId, Long caregiverId) {
        if (profileId != null && profileId > 0) {
            Optional<PlayerProfile> profileOpt = playerProfileRepository.findById(profileId);
            if (profileOpt.isPresent()) {
                PlayerProfile profile = profileOpt.get();
                if (profile.getCaregiverId() != null && profile.getCaregiverId().equals(caregiverId)) {
                    return profile;
                }
            }
        }

        // Auto-resolve caregiver's owned profile
        return playerProfileRepository.findTopByCaregiverIdOrderByIdAsc(caregiverId)
                .orElseGet(() -> {
                    PlayerProfile newProfile = new PlayerProfile();
                    newProfile.setCaregiverId(caregiverId);
                    newProfile.setPreferredName("My Loved One");
                    newProfile.setLanguage("en");
                    newProfile.setTextSize("LARGE");
                    newProfile.setAudioEnabled(true);
                    newProfile.setDifficultyMode(DifficultyMode.AUTO);
                    return playerProfileRepository.save(newProfile);
                });
    }

    @Transactional
    public MemoryGameConfigDto getConfig(Long profileId, Long caregiverId) {
        PlayerProfile profile = resolveTargetProfile(profileId, caregiverId);
        Long targetProfileId = profile.getId();

        List<MemoryGameQuestion> questions = questionRepository.findAllByPlayerProfileIdOrderBySortOrderAsc(targetProfileId);

        List<MemoryGameQuestionDto> dtos = questions.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        boolean configured = dtos.size() == REQUIRED_QUESTION_COUNT;
        return new MemoryGameConfigDto(targetProfileId, dtos, configured);
    }

    @Transactional
    public MemoryGameConfigDto saveConfig(Long profileId, Long caregiverId, List<MemoryGameQuestionDto> questionDtos) {
        PlayerProfile profile = resolveTargetProfile(profileId, caregiverId);
        Long targetProfileId = profile.getId();

        if (questionDtos == null || questionDtos.size() != REQUIRED_QUESTION_COUNT) {
            int received = questionDtos == null ? 0 : questionDtos.size();
            throw new BadRequestException("The Daily Memory Game requires exactly 5 questions (found "
                    + received + "). Please provide exactly 5 questions before saving.");
        }

        List<MemoryGameQuestion> entities = new ArrayList<>();
        for (int i = 0; i < questionDtos.size(); i++) {
            MemoryGameQuestionDto dto = questionDtos.get(i);

            if (dto.getQuestionText() == null || dto.getQuestionText().trim().isBlank()) {
                throw new BadRequestException("Question #" + (i + 1) + " is missing question text.");
            }
            if (dto.getCorrectAnswer() == null || dto.getCorrectAnswer().trim().isBlank()) {
                throw new BadRequestException("Question #" + (i + 1) + " is missing the correct answer.");
            }

            List<String> options = dto.getOptions() != null
                    ? dto.getOptions().stream().map(String::trim).filter(s -> !s.isBlank()).collect(Collectors.toList())
                    : new ArrayList<>();

            String correctTrimmed = dto.getCorrectAnswer().trim();
            if (!options.contains(correctTrimmed)) {
                options.add(correctTrimmed);
            }

            if (options.size() < 2) {
                throw new BadRequestException("Question #" + (i + 1) + " must have at least 2 distinct answer choices.");
            }

            String optionsJson;
            try {
                optionsJson = objectMapper.writeValueAsString(options);
            } catch (Exception e) {
                throw new BadRequestException("Invalid options format for question #" + (i + 1));
            }

            String imageUrl = (dto.getImageUrl() != null && !dto.getImageUrl().trim().isBlank())
                    ? dto.getImageUrl().trim() : null;

            entities.add(new MemoryGameQuestion(
                    targetProfileId,
                    caregiverId,
                    dto.getQuestionText().trim(),
                    imageUrl,
                    correctTrimmed,
                    optionsJson,
                    i
            ));
        }

        // Delete existing and persist new 5 questions transactionally
        questionRepository.deleteAllByPlayerProfileId(targetProfileId);
        List<MemoryGameQuestion> saved = questionRepository.saveAll(entities);

        List<MemoryGameQuestionDto> savedDtos = saved.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return new MemoryGameConfigDto(targetProfileId, savedDtos, true);
    }

    @Transactional(readOnly = true)
    public List<MemoryGameQuestion> getQuestionsForProfile(Long profileId) {
        return questionRepository.findAllByPlayerProfileIdOrderBySortOrderAsc(profileId);
    }

    private MemoryGameQuestionDto toDto(MemoryGameQuestion q) {
        List<String> options = new ArrayList<>();
        if (q.getOptionsJson() != null && !q.getOptionsJson().isBlank()) {
            try {
                options = objectMapper.readValue(q.getOptionsJson(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {}
        }
        return new MemoryGameQuestionDto(
                q.getId(),
                q.getQuestionText(),
                q.getImageUrl(),
                q.getCorrectAnswer(),
                options,
                q.getSortOrder()
        );
    }
}
