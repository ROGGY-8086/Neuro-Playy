package com.cognitiveplatform.service;

import com.cognitiveplatform.entity.*;
import com.cognitiveplatform.exception.ForbiddenOperationException;
import com.cognitiveplatform.exception.ResourceNotFoundException;
import com.cognitiveplatform.repository.*;
import com.cognitiveplatform.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OwnershipService {

    private final PlayerProfileRepository profileRepository;
    private final MemoryItemRepository memoryRepository;
    private final ReminderRepository reminderRepository;
    private final GameSessionRepository sessionRepository;

    public OwnershipService(PlayerProfileRepository profileRepository,
                            MemoryItemRepository memoryRepository,
                            ReminderRepository reminderRepository,
                            GameSessionRepository sessionRepository) {
        this.profileRepository = profileRepository;
        this.memoryRepository = memoryRepository;
        this.reminderRepository = reminderRepository;
        this.sessionRepository = sessionRepository;
    }

    /**
     * Verifies that the caregiver owns the given profile.
     */
    public PlayerProfile verifyProfileOwnership(Long profileId, Long caregiverId) {
        PlayerProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Player profile not found with ID: " + profileId));

        if (!profile.getCaregiverId().equals(caregiverId)) {
            throw new ForbiddenOperationException("Access denied: You do not have permission for this profile");
        }
        return profile;
    }

    /**
     * Verifies that the principal has Caregiver-level ownership access for the profile.
     * Rejects PATIENT users and caregivers who do not own the profile.
     */
    public PlayerProfile verifyCaregiverAccess(Long profileId, UserPrincipal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("Access denied: Unauthenticated request");
        }
        if (principal.getRole() == Role.PATIENT) {
            throw new ForbiddenOperationException("Access denied: Caregiver access required");
        }
        return verifyProfileOwnership(profileId, principal.getId());
    }

    /**
     * Verifies that the principal is an authorized Caregiver.
     */
    public void verifyCaregiverRole(UserPrincipal principal) {
        if (principal == null || principal.getRole() == Role.PATIENT) {
            throw new ForbiddenOperationException("Access denied: Caregiver role required");
        }
    }

    /**
     * Verifies read access to a profile:
     * - Owning Caregiver
     * - Linked Patient
     */
    public PlayerProfile verifyProfileReadAccess(Long profileId, UserPrincipal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("Access denied: Unauthenticated request");
        }

        PlayerProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Player profile not found with ID: " + profileId));

        if (principal.getRole() == Role.PATIENT) {
            if (principal.getPlayerProfileId() == null || !principal.getPlayerProfileId().equals(profileId)) {
                throw new ForbiddenOperationException("Access denied: You can only access your own profile");
            }
            return profile;
        }

        if (!profile.getCaregiverId().equals(principal.getId())) {
            throw new ForbiddenOperationException("Access denied: You do not have permission for this profile");
        }
        return profile;
    }

    /**
     * Verifies that a patient or caregiver can update display settings for the profile.
     */
    public PlayerProfile verifyProfileUpdateAccess(Long profileId, UserPrincipal principal) {
        return verifyProfileReadAccess(profileId, principal);
    }

    /**
     * Verifies that the caregiver owns the profile associated with the memory item.
     */
    public MemoryItem verifyMemoryOwnership(Long memoryId, Long caregiverId) {
        MemoryItem item = memoryRepository.findById(memoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Memory item not found with ID: " + memoryId));

        verifyProfileOwnership(item.getPlayerId(), caregiverId);
        return item;
    }

    /**
     * Verifies that the caregiver owns the profile associated with the reminder.
     */
    public Reminder verifyReminderOwnership(Long reminderId, Long caregiverId) {
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with ID: " + reminderId));

        verifyProfileOwnership(reminder.getPlayerId(), caregiverId);
        return reminder;
    }

    /**
     * Verifies that the caregiver owns the profile associated with the game session.
     */
    public GameSession verifySessionOwnership(Long sessionId, Long caregiverId) {
        GameSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Game session not found with ID: " + sessionId));

        verifyProfileOwnership(session.getPlayerId(), caregiverId);
        return session;
    }
}
