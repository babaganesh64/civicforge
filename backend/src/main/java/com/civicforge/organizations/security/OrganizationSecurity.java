package com.civicforge.organizations.security;

import com.civicforge.organizations.repository.OrganizationMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component("organizationSecurity")
@RequiredArgsConstructor
public class OrganizationSecurity {
    private final OrganizationMemberRepository organizationMemberRepository;

    public boolean isMember(UUID orgId, UUID userId) {
        return organizationMemberRepository.findByOrganizationIdAndUserId(orgId, userId)
            .map(m -> "ACTIVE".equals(m.getStatus()))
            .orElse(false);
    }
}
