package com.cognitiveplatform.service;

import com.cognitiveplatform.dto.CreateMemoryRequest;
import com.cognitiveplatform.dto.MemoryResponse;
import com.cognitiveplatform.dto.UpdateMemoryRequest;
import com.cognitiveplatform.entity.MemoryItem;
import com.cognitiveplatform.entity.MemoryType;
import com.cognitiveplatform.mapper.MemoryMapper;
import com.cognitiveplatform.repository.MemoryItemRepository;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.storage.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MemoryService {

    private final MemoryItemRepository memoryRepository;
    private final FileStorageService fileStorageService;
    private final OwnershipService ownershipService;
    private final MemoryMapper memoryMapper;

    public MemoryService(MemoryItemRepository memoryRepository,
                         FileStorageService fileStorageService,
                         OwnershipService ownershipService,
                         MemoryMapper memoryMapper) {
        this.memoryRepository = memoryRepository;
        this.fileStorageService = fileStorageService;
        this.ownershipService = ownershipService;
        this.memoryMapper = memoryMapper;
    }

    @Transactional(readOnly = true)
    public List<MemoryResponse> getMemories(Long profileId, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);
        return memoryRepository.findAllByPlayerIdOrderBySortOrderAsc(profileId).stream()
                .map(memoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MemoryResponse> getMemoriesForPrincipal(Long profileId, UserPrincipal principal) {
        ownershipService.verifyProfileReadAccess(profileId, principal);
        return memoryRepository.findAllByPlayerIdOrderBySortOrderAsc(profileId).stream()
                .map(memoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MemoryResponse createMemory(Long profileId, CreateMemoryRequest request, MultipartFile file, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        String storageKey = null;
        String mediaUrl = null;

        if (file != null && !file.isEmpty()) {
            boolean isAudio = (request.getType() == MemoryType.AUDIO);
            fileStorageService.validateFile(file, isAudio);
            String subDir = isAudio ? "audio" : "photos";
            storageKey = fileStorageService.storeFile(file, subDir);
        }

        MemoryItem item = memoryMapper.toEntity(request, profileId, null, storageKey);
        MemoryItem saved = memoryRepository.save(item);

        if (storageKey != null) {
            saved.setMediaUrl("/api/media/" + saved.getId());
            saved = memoryRepository.save(saved);
        }

        return memoryMapper.toResponse(saved);
    }

    public MemoryResponse updateMemory(Long memoryId, UpdateMemoryRequest request, Long caregiverId) {
        MemoryItem item = ownershipService.verifyMemoryOwnership(memoryId, caregiverId);
        memoryMapper.updateEntity(item, request);
        MemoryItem updated = memoryRepository.save(item);
        return memoryMapper.toResponse(updated);
    }

    public void deleteMemory(Long memoryId, Long caregiverId) {
        MemoryItem item = ownershipService.verifyMemoryOwnership(memoryId, caregiverId);
        if (item.getStorageKey() != null) {
            fileStorageService.deleteFile(item.getStorageKey());
        }
        memoryRepository.delete(item);
    }

    public List<MemoryResponse> reorderMemories(Long profileId, List<Long> orderedIds, Long caregiverId) {
        ownershipService.verifyProfileOwnership(profileId, caregiverId);

        List<MemoryItem> items = memoryRepository.findAllByPlayerIdOrderBySortOrderAsc(profileId);
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            for (MemoryItem item : items) {
                if (item.getId().equals(id)) {
                    item.setSortOrder(i + 1);
                    break;
                }
            }
        }
        memoryRepository.saveAll(items);
        return memoryRepository.findAllByPlayerIdOrderBySortOrderAsc(profileId).stream()
                .map(memoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Resource getMediaResource(Long memoryId, Long caregiverId) {
        MemoryItem item = ownershipService.verifyMemoryOwnership(memoryId, caregiverId);
        if (item.getStorageKey() == null) {
            throw new com.cognitiveplatform.exception.ResourceNotFoundException("No media file associated with memory ID: " + memoryId);
        }
        return fileStorageService.loadFileAsResource(item.getStorageKey());
    }
}
