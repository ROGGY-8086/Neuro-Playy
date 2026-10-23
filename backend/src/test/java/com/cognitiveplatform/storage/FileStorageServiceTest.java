package com.cognitiveplatform.storage;

import com.cognitiveplatform.exception.PayloadTooLargeException;
import com.cognitiveplatform.exception.UnsupportedMediaTypeException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalDiskFileStorageService storageService;

    @BeforeEach
    void setUp() {
        storageService = new LocalDiskFileStorageService(
                tempDir.toString(),
                1024 * 1024,      // 1 MB max for images
                2 * 1024 * 1024   // 2 MB max for audio
        );
    }

    @Test
    @DisplayName("Should validate and store a valid PNG image")
    void testStoreValidImage() {
        // Valid PNG header bytes
        byte[] pngBytes = new byte[] {
                (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0
        };

        MockMultipartFile file = new MockMultipartFile(
                "file", "garden.png", "image/png", pngBytes
        );

        storageService.validateFile(file, false);
        String storageKey = storageService.storeFile(file, "photos");

        assertNotNull(storageKey);
        assertTrue(storageKey.startsWith("photos/"));
        assertTrue(storageKey.endsWith(".png"));

        // Verify loaded resource
        assertNotNull(storageService.loadFileAsResource(storageKey));

        // Verify delete
        storageService.deleteFile(storageKey);
    }

    @Test
    @DisplayName("Should reject file exceeding size threshold with PayloadTooLargeException")
    void testFileTooLarge() {
        byte[] largeBytes = new byte[2 * 1024 * 1024]; // 2MB exceeds 1MB limit for image
        MockMultipartFile file = new MockMultipartFile(
                "file", "large.png", "image/png", largeBytes
        );

        assertThrows(PayloadTooLargeException.class, () ->
                storageService.validateFile(file, false)
        );
    }

    @Test
    @DisplayName("Should reject unsupported file types with UnsupportedMediaTypeException")
    void testUnsupportedMediaType() {
        byte[] exeBytes = "MZ executable binary content".getBytes();
        MockMultipartFile file = new MockMultipartFile(
                "file", "malicious.exe", "application/x-dosexec", exeBytes
        );

        assertThrows(UnsupportedMediaTypeException.class, () ->
                storageService.validateFile(file, false)
        );
    }
}
