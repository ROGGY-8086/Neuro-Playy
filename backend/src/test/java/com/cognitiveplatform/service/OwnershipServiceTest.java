package com.cognitiveplatform.service;

import com.cognitiveplatform.entity.PlayerProfile;
import com.cognitiveplatform.exception.ForbiddenOperationException;
import com.cognitiveplatform.exception.ResourceNotFoundException;
import com.cognitiveplatform.repository.GameSessionRepository;
import com.cognitiveplatform.repository.MemoryItemRepository;
import com.cognitiveplatform.repository.PlayerProfileRepository;
import com.cognitiveplatform.repository.ReminderRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OwnershipServiceTest {

    @Mock
    private PlayerProfileRepository profileRepository;

    @Mock
    private MemoryItemRepository memoryRepository;

    @Mock
    private ReminderRepository reminderRepository;

    @Mock
    private GameSessionRepository sessionRepository;

    @InjectMocks
    private OwnershipService ownershipService;

    @Test
    @DisplayName("Should return profile when caregiver matches profile owner")
    void testProfileOwnershipSuccess() {
        PlayerProfile profile = new PlayerProfile();
        profile.setId(5L);
        profile.setCaregiverId(100L);

        when(profileRepository.findById(5L)).thenReturn(Optional.of(profile));

        PlayerProfile result = ownershipService.verifyProfileOwnership(5L, 100L);
        assertNotNull(result);
        assertEquals(5L, result.getId());
    }

    @Test
    @DisplayName("Should throw ForbiddenOperationException when caregiver does not own profile")
    void testProfileOwnershipForbidden() {
        PlayerProfile profile = new PlayerProfile();
        profile.setId(5L);
        profile.setCaregiverId(100L);

        when(profileRepository.findById(5L)).thenReturn(Optional.of(profile));

        assertThrows(ForbiddenOperationException.class, () ->
                ownershipService.verifyProfileOwnership(5L, 999L)
        );
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when profile does not exist")
    void testProfileNotFound() {
        when(profileRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                ownershipService.verifyProfileOwnership(404L, 100L)
        );
    }
}
