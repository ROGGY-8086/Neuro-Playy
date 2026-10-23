package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.*;
import com.cognitiveplatform.entity.*;
import com.cognitiveplatform.exception.BadRequestException;
import com.cognitiveplatform.exception.ResourceNotFoundException;
import com.cognitiveplatform.mapper.ProfileMapper;
import com.cognitiveplatform.repository.*;
import com.cognitiveplatform.security.PasswordHasher;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    private static final String CODE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final PlayerProfileRepository profileRepository;
    private final MemoryItemRepository memoryRepository;
    private final GameSessionRepository sessionRepository;
    private final GardenStateRepository gardenRepository;
    private final ReminderRepository reminderRepository;
    private final CaregiverObservationRepository observationRepository;
    private final ConsentRecordRepository consentRepository;
    private final PatientLinkCodeRepository patientLinkCodeRepository;
    private final UserRepository userRepository;
    private final PasswordHasher passwordHasher;
    private final FileStorageService fileStorageService;
    private final OwnershipService ownershipService;
    private final ProfileMapper profileMapper;

    public ProfileService(PlayerProfileRepository profileRepository,
                          MemoryItemRepository memoryRepository,
                          GameSessionRepository sessionRepository,
                          GardenStateRepository gardenRepository,
                          ReminderRepository reminderRepository,
                          CaregiverObservationRepository observationRepository,
                          ConsentRecordRepository consentRepository,
                          PatientLinkCodeRepository patientLinkCodeRepository,
                          UserRepository userRepository,
                          PasswordHasher passwordHasher,
                          FileStorageService fileStorageService,
                          OwnershipService ownershipService,
                          ProfileMapper profileMapper) {
        this.profileRepository = profileRepository;
        this.memoryRepository = memoryRepository;
        this.sessionRepository = sessionRepository;
        this.gardenRepository = gardenRepository;
        this.reminderRepository = reminderRepository;
        this.observationRepository = observationRepository;
        this.consentRepository = consentRepository;
        this.patientLinkCodeRepository = patientLinkCodeRepository;
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.fileStorageService = fileStorageService;
        this.ownershipService = ownershipService;
        this.profileMapper = profileMapper;
    }

    @Transactional(readOnly = true)
    public List<ProfileResponse> getProfilesForCaregiver(Long caregiverId) {
        return profileRepository.findAllByCaregiverId(caregiverId).stream()
                .map(profileMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfileResponse> getProfilesForPrincipal(UserPrincipal principal) {
        if (principal.getRole() == Role.PATIENT) {
            if (principal.getPlayerProfileId() == null) {
                return Collections.emptyList();
            }
            return profileRepository.findById(principal.getPlayerProfileId())
                    .map(profileMapper::toResponse)
                    .map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        }
        return getProfilesForCaregiver(principal.getId());
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long profileId, Long caregiverId) {
        PlayerProfile profile = ownershipService.verifyProfileOwnership(profileId, caregiverId);
        return profileMapper.toResponse(profile);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfileForPrincipal(Long profileId, UserPrincipal principal) {
        PlayerProfile profile = ownershipService.verifyProfileReadAccess(profileId, principal);
        return profileMapper.toResponse(profile);
    }

    public ProfileResponse createProfile(CreateProfileRequest request, Long caregiverId) {
        PlayerProfile profile = profileMapper.toEntity(request, caregiverId);
        PlayerProfile saved = profileRepository.save(profile);
        return profileMapper.toResponse(saved);
    }

    public ProfileResponse updateProfile(Long profileId, UpdateProfileRequest request, Long caregiverId) {
        PlayerProfile profile = ownershipService.verifyProfileOwnership(profileId, caregiverId);
        profileMapper.updateEntity(profile, request);
        PlayerProfile updated = profileRepository.save(profile);
        return profileMapper.toResponse(updated);
    }

    public ProfileResponse updateProfileForPrincipal(Long profileId, UpdateProfileRequest request, UserPrincipal principal) {
        PlayerProfile profile = ownershipService.verifyProfileReadAccess(profileId, principal);
        if (principal.getRole() == Role.PATIENT) {
            // Patients can only adjust display/accessibility preferences
            if (request.getLanguage() != null && !request.getLanguage().isBlank()) {
                profile.setLanguage(request.getLanguage().trim().toLowerCase());
            }
            if (request.getTextSize() != null && !request.getTextSize().isBlank()) {
                profile.setTextSize(request.getTextSize().trim().toUpperCase());
            }
            if (request.getAudioEnabled() != null) {
                profile.setAudioEnabled(request.getAudioEnabled());
            }
        } else {
            profileMapper.updateEntity(profile, request);
        }
        PlayerProfile updated = profileRepository.save(profile);
        return profileMapper.toResponse(updated);
    }

    public void deleteProfile(Long profileId, Long caregiverId) {
        PlayerProfile profile = ownershipService.verifyProfileOwnership(profileId, caregiverId);

        // 1. Delete associated media files from physical disk
        List<MemoryItem> memories = memoryRepository.findAllByPlayerIdOrderBySortOrderAsc(profileId);
        for (MemoryItem memory : memories) {
            if (memory.getStorageKey() != null && !memory.getStorageKey().isBlank()) {
                fileStorageService.deleteFile(memory.getStorageKey());
            }
        }

        // 2. Delete all related database records
        memoryRepository.deleteAllByPlayerId(profileId);
        sessionRepository.deleteAllByPlayerId(profileId);
        gardenRepository.deleteByPlayerId(profileId);
        reminderRepository.deleteAllByPlayerId(profileId);
        observationRepository.deleteAllByPlayerId(profileId);
        consentRepository.deleteAllByPlayerId(profileId);

        // Also delete patient user if linked
        userRepository.findByPlayerProfileId(profileId).ifPresent(userRepository::delete);

        // 3. Delete the profile itself
        profileRepository.delete(profile);
    }

    // --- Link Code Generation & Patient Account Management ---

    public LinkCodeResponse generateLinkCode(Long profileId, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        // Check if patient login already exists
        if (userRepository.existsByPlayerProfileId(profileId)) {
            throw new BadRequestException("A patient login has already been created for this profile");
        }

        StringBuilder codeBuilder = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            codeBuilder.append(CODE_CHARS.charAt(RANDOM.nextInt(CODE_CHARS.length())));
        }
        String code = codeBuilder.toString();
        Instant expiresAt = Instant.now().plus(24, ChronoUnit.HOURS);

        PatientLinkCode linkCode = new PatientLinkCode(profileId, code, expiresAt, caregiverId);
        patientLinkCodeRepository.save(linkCode);

        return new LinkCodeResponse(code, expiresAt, profileId);
    }

    @Transactional(readOnly = true)
    public PatientLoginInfoResponse getPatientLoginInfo(Long profileId, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        var patientUserOpt = userRepository.findByPlayerProfileId(profileId);
        if (patientUserOpt.isPresent()) {
            User patient = patientUserOpt.get();
            return PatientLoginInfoResponse.withAccount(
                    patient.getUsername(),
                    patient.getName(),
                    patient.isEnabled(),
                    patient.getCreatedAt()
            );
        }

        var activeCodeOpt = patientLinkCodeRepository
                .findTopByPlayerProfileIdAndUsedFalseOrderByCreatedAtDesc(profileId);
        if (activeCodeOpt.isPresent()) {
            PatientLinkCode activeCode = activeCodeOpt.get();
            if (activeCode.getExpiresAt().isAfter(Instant.now())) {
                return PatientLoginInfoResponse.noAccount(activeCode.getCode(), activeCode.getExpiresAt());
            }
        }

        return PatientLoginInfoResponse.noAccount(null, null);
    }

    public void resetPatientPassword(Long profileId, String newPassword, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        if (newPassword == null || newPassword.isBlank()) {
            throw new BadRequestException("New password cannot be empty");
        }
        if (newPassword.length() > 128) {
            throw new BadRequestException("Password cannot exceed 128 characters");
        }

        User patient = userRepository.findByPlayerProfileId(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("No patient account found for this profile"));

        patient.setPasswordHash(passwordHasher.hash(newPassword));
        userRepository.save(patient);
    }

    public void updatePatientStatus(Long profileId, boolean enabled, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        User patient = userRepository.findByPlayerProfileId(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("No patient account found for this profile"));

        patient.setEnabled(enabled);
        userRepository.save(patient);
    }
}
