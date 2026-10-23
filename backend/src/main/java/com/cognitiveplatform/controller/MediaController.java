package com.cognitiveplatform.controller;

import com.cognitiveplatform.security.UserPrincipal;
import com.cognitiveplatform.service.MemoryService;
import com.cognitiveplatform.storage.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/media")
@Tag(name = "Media Streaming", description = "Authorized streaming of private photos and audio recordings")
public class MediaController {

    private final MemoryService memoryService;

    public MediaController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping("/{memoryId}")
    @Operation(summary = "Stream authorized private media file by memory ID")
    public ResponseEntity<Resource> streamMedia(
            @PathVariable("memoryId") Long memoryId,
            @AuthenticationPrincipal UserPrincipal principal) throws IOException {

        Resource resource = memoryService.getMediaResource(memoryId, principal.getId());

        String filename = resource.getFilename();
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        if (filename != null) {
            String lower = filename.toLowerCase();
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (lower.endsWith(".png")) {
                mediaType = MediaType.IMAGE_PNG;
            } else if (lower.endsWith(".webp")) {
                mediaType = MediaType.parseMediaType("image/webp");
            } else if (lower.endsWith(".gif")) {
                mediaType = MediaType.IMAGE_GIF;
            } else if (lower.endsWith(".mp3")) {
                mediaType = MediaType.parseMediaType("audio/mpeg");
            } else if (lower.endsWith(".wav")) {
                mediaType = MediaType.parseMediaType("audio/wav");
            } else if (lower.endsWith(".ogg")) {
                mediaType = MediaType.parseMediaType("audio/ogg");
            } else if (lower.endsWith(".m4a")) {
                mediaType = MediaType.parseMediaType("audio/mp4");
            }
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }
}
