package com.cognitiveplatform.controller;

import com.cognitiveplatform.dto.CreateMemoryRequest;
import com.cognitiveplatform.dto.MemoryResponse;
import com.cognitiveplatform.dto.ReorderMemoriesRequest;
import com.cognitiveplatform.dto.UpdateMemoryRequest;
import com.cognitiveplatform.entity.MemoryType;
import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.MemoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@Tag(name = "Memories", description = "Personalized photos, stories, places, and audio for reminiscence")
public class MemoryController {

    private final MemoryService memoryService;

    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping("/api/profiles/{id}/memories")
    @Operation(summary = "List all memories for a player profile")
    public ResponseEntity<List<MemoryResponse>> getMemories(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<MemoryResponse> memories = memoryService.getMemoriesForPrincipal(id, principal);
        return ResponseEntity.ok(memories);
    }

    @PostMapping(value = "/api/profiles/{id}/memories", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload and attach a new memory item with optional photo or audio file")
    public ResponseEntity<MemoryResponse> createMemoryMultipart(
            @PathVariable("id") Long id,
            @RequestPart(value = "data", required = false) CreateMemoryRequest data,
            @RequestParam(value = "type", required = false) MemoryType type,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "transcript", required = false) String transcript,
            @RequestParam(value = "sortOrder", defaultValue = "0") int sortOrder,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) {

        CreateMemoryRequest request;
        if (data != null) {
            request = data;
        } else {
            if (type == null) type = MemoryType.PHOTO;
            if (title == null || title.isBlank()) title = "Untitled Memory";
            request = new CreateMemoryRequest(type, title, description, transcript, sortOrder);
        }

        MemoryResponse response = memoryService.createMemory(id, request, file, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(value = "/api/profiles/{id}/memories", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create a text/narrative memory item (without file upload)")
    public ResponseEntity<MemoryResponse> createMemoryJson(
            @PathVariable("id") Long id,
            @Valid @RequestBody CreateMemoryRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        MemoryResponse response = memoryService.createMemory(id, request, null, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/memories/{id}")
    @Operation(summary = "Update an existing memory item")
    public ResponseEntity<MemoryResponse> updateMemory(
            @PathVariable("id") Long id,
            @Valid @RequestBody UpdateMemoryRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        MemoryResponse response = memoryService.updateMemory(id, request, principal.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/memories/{id}")
    @Operation(summary = "Delete a memory item and its stored media file")
    public ResponseEntity<Void> deleteMemory(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        memoryService.deleteMemory(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/api/profiles/{id}/memories/reorder")
    @Operation(summary = "Update the display order of memory items")
    public ResponseEntity<List<MemoryResponse>> reorderMemories(
            @PathVariable("id") Long id,
            @Valid @RequestBody ReorderMemoriesRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<MemoryResponse> updated = memoryService.reorderMemories(id, request.getOrderedMemoryIds(), principal.getId());
        return ResponseEntity.ok(updated);
    }
}
