package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.GardenStateRequest;
import com.cognitiveplatform.dto.GardenStateResponse;
import com.cognitiveplatform.entity.GardenState;
import com.cognitiveplatform.mapper.GardenMapper;
import com.cognitiveplatform.repository.GardenStateRepository;
import com.cognitiveplatform.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
public class GardenService {

    private final GardenStateRepository gardenRepository;
    private final OwnershipService ownershipService;
    private final GardenMapper gardenMapper;

    public GardenService(GardenStateRepository gardenRepository,
                         OwnershipService ownershipService,
                         GardenMapper gardenMapper) {
        this.gardenRepository = gardenRepository;
        this.ownershipService = ownershipService;
        this.gardenMapper = gardenMapper;
    }

    @Transactional(readOnly = true)
    public GardenStateResponse getGarden(Long profileId, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        GardenState state = gardenRepository.findByPlayerId(profileId)
                .orElseGet(() -> new GardenState(profileId, "[]", "[]"));
        return gardenMapper.toResponse(state);
    }

    @Transactional(readOnly = true)
    public GardenStateResponse getGardenForPrincipal(Long profileId, UserPrincipal principal) {
        ownershipService.verifyProfileReadAccess(profileId, principal);

        GardenState state = gardenRepository.findByPlayerId(profileId)
                .orElseGet(() -> new GardenState(profileId, "[]", "[]"));
        return gardenMapper.toResponse(state);
    }

    public GardenStateResponse updateGarden(Long profileId, GardenStateRequest request, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        GardenState state = gardenRepository.findByPlayerId(profileId)
                .orElse(new GardenState(profileId, "[]", "[]"));

        state.setPlantsJson(request.getPlantsJson());
        state.setItemsJson(request.getItemsJson());
        state.setUpdatedAt(Instant.now());

        GardenState saved = gardenRepository.save(state);
        return gardenMapper.toResponse(saved);
    }

    public GardenStateResponse updateGardenForPrincipal(Long profileId, GardenStateRequest request, UserPrincipal principal) {
        ownershipService.verifyProfileReadAccess(profileId, principal);

        GardenState state = gardenRepository.findByPlayerId(profileId)
                .orElse(new GardenState(profileId, "[]", "[]"));

        state.setPlantsJson(request.getPlantsJson());
        state.setItemsJson(request.getItemsJson());
        state.setUpdatedAt(Instant.now());

        GardenState saved = gardenRepository.save(state);
        return gardenMapper.toResponse(saved);
    }
}
