package com.cognitiveplatform.storage;

import com.cognitiveplatform.exception.BadRequestException;
import com.cognitiveplatform.exception.PayloadTooLargeException;
import com.cognitiveplatform.exception.ResourceNotFoundException;
import com.cognitiveplatform.exception.UnsupportedMediaTypeException;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class LocalDiskFileStorageService implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalDiskFileStorageService.class);

    private final Path rootLocation;
    private final long maxImageSizeBytes;
    private final long maxAudioSizeBytes;
    private final Tika tika = new Tika();

    private static final List<String> ALLOWED_IMAGE_MIMES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private static final List<String> ALLOWED_AUDIO_MIMES = Arrays.asList(
            "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav",
            "audio/ogg", "audio/webm", "audio/m4a", "audio/mp4", "audio/x-m4a"
    );

    public LocalDiskFileStorageService(
            @Value("${app.storage.upload-dir:uploads/media}") String uploadDir,
            @Value("${app.storage.max-image-size-bytes:5242880}") long maxImageSizeBytes,
            @Value("${app.storage.max-audio-size-bytes:10485760}") long maxAudioSizeBytes) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.maxImageSizeBytes = maxImageSizeBytes;
        this.maxAudioSizeBytes = maxAudioSizeBytes;

        try {
            Files.createDirectories(this.rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory at " + uploadDir, e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "file"
        );

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        // Generate safe unique storage key
        String storageKey = UUID.randomUUID().toString() + extension;
        Path targetDir = this.rootLocation;
        if (subDirectory != null && !subDirectory.isBlank()) {
            targetDir = this.rootLocation.resolve(subDirectory).normalize();
            try {
                Files.createDirectories(targetDir);
            } catch (IOException e) {
                throw new RuntimeException("Could not create storage subdirectory", e);
            }
        }

        Path targetLocation = targetDir.resolve(storageKey).normalize();
        if (!targetLocation.startsWith(this.rootLocation)) {
            throw new BadRequestException("Cannot store file outside current storage directory");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return (subDirectory != null && !subDirectory.isBlank()) ? subDirectory + "/" + storageKey : storageKey;
        } catch (IOException e) {
            log.error("Failed to store file: {}", originalFilename, e);
            throw new RuntimeException("Failed to store file securely", e);
        }
    }

    @Override
    public Resource loadFileAsResource(String storageKey) {
        try {
            Path filePath = this.rootLocation.resolve(storageKey).normalize();
            if (!filePath.startsWith(this.rootLocation)) {
                throw new BadRequestException("Invalid file path request");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("Media file not found: " + storageKey);
            }
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Invalid media file URL");
        }
    }

    @Override
    public void deleteFile(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) return;
        try {
            Path filePath = this.rootLocation.resolve(storageKey).normalize();
            if (filePath.startsWith(this.rootLocation)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            log.warn("Could not delete file: {}", storageKey, e);
        }
    }

    @Override
    public String determineMimeType(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            return tika.detect(is, file.getOriginalFilename());
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }

    @Override
    public void validateFile(MultipartFile file, boolean isAudio) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty or missing");
        }

        long maxSize = isAudio ? maxAudioSizeBytes : maxImageSizeBytes;
        if (file.getSize() > maxSize) {
            throw new PayloadTooLargeException("File size " + file.getSize() + " exceeds the limit of " + maxSize + " bytes");
        }

        String detectedMime = determineMimeType(file);
        List<String> allowedMimes = isAudio ? ALLOWED_AUDIO_MIMES : ALLOWED_IMAGE_MIMES;

        if (!allowedMimes.contains(detectedMime.toLowerCase())) {
            throw new UnsupportedMediaTypeException("Unsupported media type: " + detectedMime + ". Permitted formats: " + (isAudio ? "MP3, WAV, OGG, M4A" : "JPEG, PNG, WebP, GIF"));
        }
    }
}
