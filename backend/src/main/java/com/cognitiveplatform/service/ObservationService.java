package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.CreateObservationRequest;
import com.cognitiveplatform.dto.ObservationResponse;
import com.cognitiveplatform.entity.CaregiverObservation;
import com.cognitiveplatform.mapper.ObservationMapper;
import com.cognitiveplatform.repository.CaregiverObservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ObservationService {

    private final CaregiverObservationRepository observationRepository;
    private final OwnershipService ownershipService;
    private final ObservationMapper observationMapper;

    public ObservationService(CaregiverObservationRepository observationRepository,
                              OwnershipService ownershipService,
                              ObservationMapper observationMapper) {
        this.observationRepository = observationRepository;
        this.ownershipService = ownershipService;
        this.observationMapper = observationMapper;
    }

    @Transactional(readOnly = true)
    public List<ObservationResponse> getObservations(Long profileId, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        return observationRepository.findAllByPlayerIdOrderByCreatedAtDesc(profileId).stream()
                .map(observationMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ObservationResponse addObservation(Long profileId, CreateObservationRequest request, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        CaregiverObservation observation = observationMapper.toEntity(request, profileId, caregiverId);
        CaregiverObservation saved = observationRepository.save(observation);
        return observationMapper.toResponse(saved);
    }
}
