package com.civicforge.files.dto;

import java.util.UUID;

public record FileUploadResponse(
    UUID fileId,
    String originalFilename,
    long sizeBytes,
    String contentType
) {}
