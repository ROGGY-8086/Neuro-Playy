package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.*;
import com.cognitiveplatform.exception.BadRequestException;
import com.cognitiveplatform.exception.ResourceNotFoundException;
import com.cognitiveplatform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GuardianProfileService {

    private final UserProfileRepository userProfileRepository;
    private final RelativeRepository relativeRepository;
    private final LifeEventRepository lifeEventRepository;
    private final PersonalQuestionRepository personalQuestionRepository;
    private final UserRepository userRepository;

    public GuardianProfileService(UserProfileRepository userProfileRepository,
                                  RelativeRepository relativeRepository,
                                  LifeEventRepository lifeEventRepository,
                                  PersonalQuestionRepository personalQuestionRepository,
                                  UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.relativeRepository = relativeRepository;
        this.lifeEventRepository = lifeEventRepository;
        this.personalQuestionRepository = personalQuestionRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public boolean isSetupCompleted(Long userId) {
        return userProfileRepository.existsByUserIdAndSetupCompletedTrue(userId);
    }

    @Transactional(readOnly = true)
    public boolean hasBasicProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .map(p -> p.getFullName() != null && !p.getFullName().trim().isEmpty())
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public GuardianProfileBundleDto getProfileBundle(Long userId) {
        GuardianProfileBundleDto bundle = new GuardianProfileBundleDto();

        userProfileRepository.findByUserId(userId).ifPresent(p -> {
            bundle.setProfile(toDto(p));
            bundle.setSetupCompleted(p.isSetupCompleted());
        });

        List<RelativeDto> relatives = relativeRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        bundle.setRelatives(relatives);

        List<LifeEventDto> lifeEvents = lifeEventRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        bundle.setLifeEvents(lifeEvents);

        List<PersonalQuestionDto> customQuestions = personalQuestionRepository.findByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        bundle.setCustomQuestions(customQuestions);

        return bundle;
    }

    @Transactional
    public GuardianProfileBundleDto saveProfileBundle(Long userId, GuardianProfileBundleDto bundle) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        // 1. Save or update basic profile
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> new UserProfile(userId, ""));

        if (bundle.getProfile() != null) {
            UserProfileDto pDto = bundle.getProfile();
            profile.setFullName(pDto.getFullName() != null ? pDto.getFullName().trim() : "Participant");
            profile.setNickname(pDto.getNickname() != null ? pDto.getNickname().trim() : null);
            profile.setDateOfBirth(pDto.getDateOfBirth());
            profile.setPlaceOfBirth(pDto.getPlaceOfBirth() != null ? pDto.getPlaceOfBirth().trim() : null);
            profile.setHometown(pDto.getHometown() != null ? pDto.getHometown().trim() : null);
            profile.setPreferredLanguage(pDto.getPreferredLanguage() != null ? pDto.getPreferredLanguage().trim() : "en");
        } else if (profile.getFullName() == null || profile.getFullName().isBlank()) {
            profile.setFullName("Participant");
        }

        // Mark setup complete
        profile.setSetupCompleted(true);
        userProfileRepository.save(profile);

        // 2. Sync Relatives
        relativeRepository.deleteByUserId(userId);
        if (bundle.getRelatives() != null) {
            for (RelativeDto rDto : bundle.getRelatives()) {
                if (rDto.getFullName() != null && !rDto.getFullName().isBlank() &&
                        rDto.getRelationship() != null && !rDto.getRelationship().isBlank()) {
                    Relative rel = new Relative(userId, rDto.getFullName().trim(), rDto.getRelationship().trim());
                    rel.setDateOfBirth(rDto.getDateOfBirth());
                    rel.setImportantDetails(rDto.getImportantDetails());
                    relativeRepository.save(rel);
                }
            }
        }

        // 3. Sync Life Events
        lifeEventRepository.deleteByUserId(userId);
        if (bundle.getLifeEvents() != null) {
            for (LifeEventDto eDto : bundle.getLifeEvents()) {
                if (eDto.getEventTitle() != null && !eDto.getEventTitle().isBlank() &&
                        eDto.getEventDescription() != null && !eDto.getEventDescription().isBlank()) {
                    LifeEvent event = new LifeEvent(userId, eDto.getEventTitle().trim(), eDto.getEventDescription().trim());
                    event.setEventDate(eDto.getEventDate());
                    event.setApproximateYear(eDto.getApproximateYear());
                    event.setEventPlace(eDto.getEventPlace());
                    event.setPeopleInvolved(eDto.getPeopleInvolved());
                    lifeEventRepository.save(event);
                }
            }
        }

        // 4. Sync Custom Questions
        personalQuestionRepository.deleteByUserId(userId);
        if (bundle.getCustomQuestions() != null) {
            for (PersonalQuestionDto qDto : bundle.getCustomQuestions()) {
                if (qDto.getQuestionText() != null && !qDto.getQuestionText().isBlank() &&
                        qDto.getCorrectAnswer() != null && !qDto.getCorrectAnswer().isBlank()) {
                    PersonalQuestion pq = new PersonalQuestion(
                            userId,
                            qDto.getQuestionText().trim(),
                            qDto.getCorrectAnswer().trim(),
                            qDto.getCategory() != null ? qDto.getCategory().trim() : "Personal"
                    );
                    pq.setAlternativeAnswers(qDto.getAlternativeAnswers());
                    pq.setDifficulty(qDto.getDifficulty());
                    pq.setActive(qDto.isActive());
                    personalQuestionRepository.save(pq);
                }
            }
        }

        return getProfileBundle(userId);
    }

    // Individual relative CRUD
    @Transactional
    public RelativeDto addRelative(Long userId, RelativeDto dto) {
        if (dto.getFullName() == null || dto.getFullName().isBlank()) {
            throw new BadRequestException("Relative full name cannot be empty");
        }
        if (dto.getRelationship() == null || dto.getRelationship().isBlank()) {
            throw new BadRequestException("Relationship cannot be empty");
        }
        Relative relative = new Relative(userId, dto.getFullName().trim(), dto.getRelationship().trim());
        relative.setDateOfBirth(dto.getDateOfBirth());
        relative.setImportantDetails(dto.getImportantDetails());
        Relative saved = relativeRepository.save(relative);
        return toDto(saved);
    }

    @Transactional
    public void deleteRelative(Long userId, Long relativeId) {
        Relative rel = relativeRepository.findByIdAndUserId(relativeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Relative not found"));
        relativeRepository.delete(rel);
    }

    // Individual life event CRUD
    @Transactional
    public LifeEventDto addLifeEvent(Long userId, LifeEventDto dto) {
        if (dto.getEventTitle() == null || dto.getEventTitle().isBlank()) {
            throw new BadRequestException("Event title cannot be empty");
        }
        if (dto.getEventDescription() == null || dto.getEventDescription().isBlank()) {
            throw new BadRequestException("Event description cannot be empty");
        }
        LifeEvent event = new LifeEvent(userId, dto.getEventTitle().trim(), dto.getEventDescription().trim());
        event.setEventDate(dto.getEventDate());
        event.setApproximateYear(dto.getApproximateYear());
        event.setEventPlace(dto.getEventPlace());
        event.setPeopleInvolved(dto.getPeopleInvolved());
        LifeEvent saved = lifeEventRepository.save(event);
        return toDto(saved);
    }

    @Transactional
    public void deleteLifeEvent(Long userId, Long eventId) {
        LifeEvent ev = lifeEventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Life event not found"));
        lifeEventRepository.delete(ev);
    }

    // Individual custom question CRUD
    @Transactional
    public PersonalQuestionDto addCustomQuestion(Long userId, PersonalQuestionDto dto) {
        if (dto.getQuestionText() == null || dto.getQuestionText().isBlank()) {
            throw new BadRequestException("Question text cannot be empty");
        }
        if (dto.getCorrectAnswer() == null || dto.getCorrectAnswer().isBlank()) {
            throw new BadRequestException("Correct answer cannot be empty");
        }
        PersonalQuestion pq = new PersonalQuestion(
                userId,
                dto.getQuestionText().trim(),
                dto.getCorrectAnswer().trim(),
                dto.getCategory() != null ? dto.getCategory().trim() : "Personal"
        );
        pq.setAlternativeAnswers(dto.getAlternativeAnswers());
        pq.setDifficulty(dto.getDifficulty());
        pq.setActive(dto.isActive());
        PersonalQuestion saved = personalQuestionRepository.save(pq);
        return toDto(saved);
    }

    @Transactional
    public void deleteCustomQuestion(Long userId, Long questionId) {
        PersonalQuestion pq = personalQuestionRepository.findByIdAndUserId(questionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Personal question not found"));
        personalQuestionRepository.delete(pq);
    }

    // Mappers
    private UserProfileDto toDto(UserProfile p) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUserId());
        dto.setFullName(p.getFullName());
        dto.setNickname(p.getNickname());
        dto.setDateOfBirth(p.getDateOfBirth());
        dto.setPlaceOfBirth(p.getPlaceOfBirth());
        dto.setHometown(p.getHometown());
        dto.setPreferredLanguage(p.getPreferredLanguage());
        dto.setSetupCompleted(p.isSetupCompleted());
        return dto;
    }

    private RelativeDto toDto(Relative r) {
        return new RelativeDto(r.getId(), r.getFullName(), r.getRelationship(), r.getDateOfBirth(), r.getImportantDetails());
    }

    private LifeEventDto toDto(LifeEvent e) {
        LifeEventDto dto = new LifeEventDto();
        dto.setId(e.getId());
        dto.setUserId(e.getUserId());
        dto.setEventTitle(e.getEventTitle());
        dto.setEventDate(e.getEventDate());
        dto.setApproximateYear(e.getApproximateYear());
        dto.setEventPlace(e.getEventPlace());
        dto.setPeopleInvolved(e.getPeopleInvolved());
        dto.setEventDescription(e.getEventDescription());
        return dto;
    }

    private PersonalQuestionDto toDto(PersonalQuestion q) {
        PersonalQuestionDto dto = new PersonalQuestionDto();
        dto.setId(q.getId());
        dto.setUserId(q.getUserId());
        dto.setQuestionText(q.getQuestionText());
        dto.setCorrectAnswer(q.getCorrectAnswer());
        dto.setAlternativeAnswers(q.getAlternativeAnswers());
        if (q.getAlternativeAnswers() != null) {
            String[] parts = q.getAlternativeAnswers().split("\\|\\|");
            if (parts.length > 0) dto.setWrongAnswer1(parts[0].trim());
            if (parts.length > 1) dto.setWrongAnswer2(parts[1].trim());
            if (parts.length > 2) dto.setWrongAnswer3(parts[2].trim());
        }
        dto.setCategory(q.getCategory());
        dto.setDifficulty(q.getDifficulty());
        dto.setSourceType(q.getSourceType());
        dto.setSourceId(q.getSourceId());
        dto.setActive(q.isActive());
        return dto;
    }
}
