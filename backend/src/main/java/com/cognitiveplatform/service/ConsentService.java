package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.ConsentResponse;
import com.cognitiveplatform.dto.CreateConsentRequest;
import com.cognitiveplatform.entity.ConsentRecord;
import com.cognitiveplatform.mapper.ConsentMapper;
import com.cognitiveplatform.repository.ConsentRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConsentService {

    private final ConsentRecordRepository consentRepository;
    private final OwnershipService ownershipService;
    private final ConsentMapper consentMapper;

    public ConsentService(ConsentRecordRepository consentRepository,
                          OwnershipService ownershipService,
                          ConsentMapper consentMapper) {
        this.consentRepository = consentRepository;
        this.ownershipService = ownershipService;
        this.consentMapper = consentMapper;
    }

    @Transactional(readOnly = true)
    public List<ConsentResponse> getConsents(Long profileId, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        return consentRepository.findAllByPlayerId(profileId).stream()
                .map(consentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ConsentResponse recordConsent(Long profileId, CreateConsentRequest request, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        ConsentRecord record = consentMapper.toEntity(request, profileId, caregiverId);
        ConsentRecord saved = consentRepository.save(record);
        return consentMapper.toResponse(saved);
    }
}
