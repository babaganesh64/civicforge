package com.civicforge.files.repository;

import com.civicforge.files.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, UUID> {
    Optional<FileMetadata> findByIdAndOwnerId(UUID id, UUID ownerId);
    List<FileMetadata> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
