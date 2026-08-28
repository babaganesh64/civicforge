package com.civicforge.files.controller;

import com.civicforge.common.dto.ApiResponse;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.files.dto.FileUploadResponse;
import com.civicforge.files.entity.FileMetadata;
import com.civicforge.files.repository.FileMetadataRepository;
import com.civicforge.files.service.FileStorageService;
import com.civicforge.identity.security.CivicForgeUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
@Slf4j
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;
    private final FileMetadataRepository fileMetadataRepository;

    private CivicForgeUserDetails principal() {
        return (CivicForgeUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/upload")
    public ApiResponse<FileUploadResponse> uploadFile(
        @RequestPart MultipartFile file,
        @RequestParam String purpose
    ) {
        CivicForgeUserDetails user = principal();
        FileMetadata metadata = fileStorageService.storeFile(file, user.getUserId(), purpose);
        FileUploadResponse response = new FileUploadResponse(
            metadata.getId(),
            metadata.getOriginalFilename(),
            metadata.getSizeBytes(),
            metadata.getContentType()
        );
        return ApiResponse.success(response, "File uploaded successfully");
    }

    @GetMapping("/{id}/url")
    public ApiResponse<String> getFileUrl(@PathVariable UUID id) {
        CivicForgeUserDetails user = principal();
        FileMetadata metadata = fileMetadataRepository.findById(id)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.NOT_FOUND, "File not found", HttpStatus.NOT_FOUND));

        if (!metadata.getOwnerId().equals(user.getUserId()) && !user.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "").startsWith("GOVERNMENT_")) {
            throw new CivicForgeException(ErrorCode.FORBIDDEN, "Access denied", HttpStatus.FORBIDDEN);
        }

        String url = fileStorageService.generatePresignedUrl(metadata, Duration.ofHours(1));
        return ApiResponse.success(url, "URL generated successfully");
    }
}
