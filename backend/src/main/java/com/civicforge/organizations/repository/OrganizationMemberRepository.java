package com.civicforge.organizations.repository;

import com.civicforge.organizations.entity.OrganizationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember, UUID> {
    List<OrganizationMember> findByUserIdAndStatus(UUID userId, String status);
    Optional<OrganizationMember> findByOrganizationIdAndUserId(UUID orgId, UUID userId);
    List<OrganizationMember> findByOrganizationIdAndStatus(UUID orgId, String status);
    boolean existsByOrganizationIdAndUserId(UUID orgId, UUID userId);
}
