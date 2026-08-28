package com.civicforge.organizations.dto;

import com.civicforge.organizations.entity.Organization;
import java.time.Instant;
import java.util.UUID;

public record OrganizationDto(
    UUID id,
    String name,
    String shortName,
    String orgType,
    String verificationStatus,
    String geography,
    String contactEmail,
    boolean active,
    Instant createdAt
) {
    public static OrganizationDto from(Organization org) {
        return new OrganizationDto(
            org.getId(),
            org.getName(),
            org.getShortName(),
            org.getOrgType(),
            org.getVerificationStatus(),
            org.getGeography(),
            org.getContactEmail(),
            org.isActive(),
            org.getCreatedAt()
        );
    }
}
