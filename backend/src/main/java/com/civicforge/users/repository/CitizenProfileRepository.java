package com.civicforge.users.repository;

import com.civicforge.users.entity.CitizenProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, UUID> {
    Optional<CitizenProfile> findByUserId(UUID userId);
}
