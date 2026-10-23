package com.cognitiveplatform.mapper;

import com.cognitiveplatform.dto.CreateMemoryRequest;
import com.cognitiveplatform.dto.MemoryResponse;
import com.cognitiveplatform.dto.UpdateMemoryRequest;
import com.cognitiveplatform.entity.MemoryItem;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class MemoryMapper {

    public MemoryItem toEntity(CreateMemoryRequest request, Long playerId, String mediaUrl, String storageKey) {
        if (request == null) return null;
        MemoryItem item = new MemoryItem();
        item.setPlayerId(playerId);
        item.setType(request.getType());
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setTranscript(request.getTranscript());
        item.setSortOrder(request.getSortOrder());
        item.setMediaUrl(mediaUrl);
        item.setStorageKey(storageKey);
        item.setCreatedAt(Instant.now());
        return item;
    }

    public void updateEntity(MemoryItem item, UpdateMemoryRequest request) {
        if (item == null || request == null) return;
        if (request.getTitle() != null) item.setTitle(request.getTitle());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getTranscript() != null) item.setTranscript(request.getTranscript());
        if (request.getSortOrder() != null) item.setSortOrder(request.getSortOrder());
    }

    public MemoryResponse toResponse(MemoryItem entity) {
        if (entity == null) return null;
        MemoryResponse resp = new MemoryResponse();
        resp.setId(entity.getId());
        resp.setPlayerId(entity.getPlayerId());
        resp.setType(entity.getType());
        resp.setTitle(entity.getTitle());
        resp.setDescription(entity.getDescription());
        resp.setMediaUrl(entity.getMediaUrl());
        resp.setTranscript(entity.getTranscript());
        resp.setSortOrder(entity.getSortOrder());
        resp.setCreatedAt(entity.getCreatedAt());
        return resp;
    }
}
