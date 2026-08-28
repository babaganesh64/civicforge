package com.civicforge.files.service;

import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.files.entity.FileMetadata;
import com.civicforge.files.repository.FileMetadataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileStorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final FileMetadataRepository fileMetadataRepository;

    @Value("${app.storage.bucket:civicforge-files}")
    private String bucketName;

    private static final Set<String> ALLOWED_TYPES = Set.of(
        "image/jpeg", "image/png", "image/gif",
        "application/pdf", "text/plain", "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "video/mp4"
    );

    private static final long MAX_SIZE = 50 * 1024 * 1024; // 50MB

    public FileMetadata storeFile(MultipartFile file, UUID ownerId, String purpose) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new CivicForgeException(ErrorCode.FILE_TYPE_NOT_ALLOWED, "File type not allowed: " + contentType, HttpStatus.BAD_REQUEST);
        }
        if (file.getSize() > MAX_SIZE) {
            throw new CivicForgeException(ErrorCode.FILE_TOO_LARGE, "File size exceeds limit of 50MB", HttpStatus.BAD_REQUEST);
        }

        UUID fileId = UUID.randomUUID();
        String originalFilename = file.getOriginalFilename();
        LocalDate now = LocalDate.now();
        String storedKey = String.format("uploads/%s/%d/%02d/%s/%s",
            purpose, now.getYear(), now.getMonthValue(), fileId, originalFilename);

        try {
            PutObjectRequest putObj = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(storedKey)
                .contentType(contentType)
                .build();
            s3Client.putObject(putObj, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            log.error("Failed to upload file {}", originalFilename, e);
            throw new CivicForgeException(ErrorCode.FILE_UPLOAD_FAILED, "Failed to upload file to storage", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        FileMetadata metadata = FileMetadata.builder()
            .id(fileId)
            .ownerId(ownerId)
            .originalFilename(originalFilename)
            .storedKey(storedKey)
            .bucketName(bucketName)
            .contentType(contentType)
            .sizeBytes(file.getSize())
            .purpose(purpose)
            .status("UPLOADED")
            .build();

        return fileMetadataRepository.save(metadata);
    }

    public String generatePresignedUrl(FileMetadata metadata, Duration validity) {
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(validity)
            .getObjectRequest(req -> req.bucket(metadata.getBucketName()).key(metadata.getStoredKey()))
            .build();
        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
        return presignedRequest.url().toString();
    }

    public void deleteFile(UUID fileId, UUID requesterId) {
        FileMetadata metadata = fileMetadataRepository.findByIdAndOwnerId(fileId, requesterId)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.NOT_FOUND, "File not found or access denied", HttpStatus.FORBIDDEN));

        try {
            DeleteObjectRequest delReq = DeleteObjectRequest.builder()
                .bucket(metadata.getBucketName())
                .key(metadata.getStoredKey())
                .build();
            s3Client.deleteObject(delReq);
        } catch (Exception e) {
            log.warn("Failed to delete file from S3: {}", metadata.getStoredKey(), e);
        }

        fileMetadataRepository.delete(metadata);
    }
}
