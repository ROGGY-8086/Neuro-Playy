package com.cognitiveplatform.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * Pluggable file storage interface.
 * Implemented locally via disk storage, and can be swapped with AWS S3,
 * Google Cloud Storage, or Azure Blob Storage in production environments.
 */
public interface FileStorageService {

    /**
     * Validates and stores an uploaded file into the designated subdirectory.
     * @param file the multipart file to store
     * @param subDirectory optional category directory (e.g. "photos", "audio")
     * @return the unique storage key / filename
     */
    String storeFile(MultipartFile file, String subDirectory);

    /**
     * Loads a file resource by its storage key for authorized streaming.
     * @param storageKey the unique storage key
     * @return the file resource
     */
    Resource loadFileAsResource(String storageKey);

    /**
     * Deletes a file from storage.
     * @param storageKey the unique storage key
     */
    void deleteFile(String storageKey);

    /**
     * Inspects magic bytes and returns the detected MIME type.
     * @param file the file to inspect
     * @return the MIME type string
     */
    String determineMimeType(MultipartFile file);

    /**
     * Validates file extension, MIME type, and size.
     * @param file the file to validate
     * @param isAudio true if validating an audio file, false for image
     */
    void validateFile(MultipartFile file, boolean isAudio);
}
