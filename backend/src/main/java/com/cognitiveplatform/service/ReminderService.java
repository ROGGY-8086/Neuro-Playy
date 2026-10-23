package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.CreateReminderRequest;
import com.cognitiveplatform.dto.ReminderResponse;
import com.cognitiveplatform.dto.UpdateReminderRequest;
import com.cognitiveplatform.entity.Reminder;
import com.cognitiveplatform.mapper.ReminderMapper;
import com.cognitiveplatform.repository.ReminderRepository;
import com.cognitiveplatform.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final OwnershipService ownershipService;
    private final ReminderMapper reminderMapper;

    public ReminderService(ReminderRepository reminderRepository,
                           OwnershipService ownershipService,
                           ReminderMapper reminderMapper) {
        this.reminderRepository = reminderRepository;
        this.ownershipService = ownershipService;
        this.reminderMapper = reminderMapper;
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getReminders(Long profileId, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        return reminderRepository.findAllByPlayerIdOrderByScheduledAtAsc(profileId).stream()
                .map(reminderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getRemindersForPrincipal(Long profileId, UserPrincipal principal) {
        ownershipService.verifyProfileReadAccess(profileId, principal);
        return reminderRepository.findAllByPlayerIdOrderByScheduledAtAsc(profileId).stream()
                .map(reminderMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ReminderResponse createReminder(Long profileId, CreateReminderRequest request, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        Reminder reminder = reminderMapper.toEntity(request, profileId, caregiverId);
        Reminder saved = reminderRepository.save(reminder);
        return reminderMapper.toResponse(saved);
    }

    public ReminderResponse updateReminder(Long reminderId, UpdateReminderRequest request, Long caregiverId) {
        Reminder reminder = ownershipService.verifyReminderOwnership(reminderId, caregiverId);
        reminderMapper.updateEntity(reminder, request);
        Reminder updated = reminderRepository.save(reminder);
        return reminderMapper.toResponse(updated);
    }

    public void deleteReminder(Long reminderId, Long caregiverId) {
        Reminder reminder = ownershipService.verifyReminderOwnership(reminderId, caregiverId);
        reminderRepository.delete(reminder);
    }
}
