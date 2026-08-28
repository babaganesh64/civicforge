package com.civicforge.organizations.dto;

import com.civicforge.organizations.entity.OrganizationMember;
import java.time.Instant;
import java.util.UUID;

public record OrganizationMemberDto(
    UUID id,
    UUID organizationId,
    UUID userId,
    String role,
    String status,
    Instant joinedAt
) {
    public static OrganizationMemberDto from(OrganizationMember m) {
        return new OrganizationMemberDto(
            m.getId(),
            m.getOrganizationId(),
            m.getUserId(),
            m.getRole(),
            m.getStatus(),
            m.getJoinedAt()
        );
    }
}
