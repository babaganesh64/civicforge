package com.civicforge.organizations.service;

import com.civicforge.audit.service.AuditService;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.organizations.dto.AddMemberRequest;
import com.civicforge.organizations.dto.CreateOrganizationRequest;
import com.civicforge.organizations.dto.OrganizationDto;
import com.civicforge.organizations.dto.OrganizationMemberDto;
import com.civicforge.organizations.entity.Organization;
import com.civicforge.organizations.entity.OrganizationMember;
import com.civicforge.organizations.repository.OrganizationMemberRepository;
import com.civicforge.organizations.repository.OrganizationRepository;
import com.civicforge.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public OrganizationDto createOrganization(CreateOrganizationRequest req, UUID actorId) {
        if (!"GOVERNMENT".equals(req.orgType()) && !"UNIVERSITY".equals(req.orgType()) && !"INDUSTRY".equals(req.orgType())) {
            throw new CivicForgeException(ErrorCode.VALIDATION_ERROR, "Invalid organization type", HttpStatus.BAD_REQUEST);
        }

        Organization org = Organization.builder()
            .name(req.name())
            .shortName(req.shortName())
            .orgType(req.orgType())
            .website(req.website())
            .description(req.description())
            .geography(req.geography())
            .contactEmail(req.contactEmail())
            .contactPhone(req.contactPhone())
            .verificationStatus("PENDING")
            .active(true)
            .build();

        organizationRepository.save(org);
        auditService.audit("USER_CREATE_ORG", "ORGANIZATION", org.getId().toString(), "SUCCESS", null);

        return OrganizationDto.from(org);
    }

    public OrganizationDto getOrganization(UUID id) {
        Organization org = organizationRepository.findById(id)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.NOT_FOUND, "Organization not found", HttpStatus.NOT_FOUND));
        return OrganizationDto.from(org);
    }

    public Page<OrganizationDto> listOrganizations(String orgType, Pageable pageable) {
        if (orgType != null && !orgType.isBlank()) {
            return organizationRepository.findByOrgTypeAndActive(orgType, true, pageable).map(OrganizationDto::from);
        }
        return organizationRepository.findAll(pageable).map(OrganizationDto::from);
    }

    public OrganizationMemberDto addMember(UUID orgId, AddMemberRequest req, UUID actorId) {
        if (!organizationRepository.existsById(orgId)) {
            throw new CivicForgeException(ErrorCode.NOT_FOUND, "Organization not found", HttpStatus.NOT_FOUND);
        }

        if (!userRepository.existsById(req.userId())) {
            throw new CivicForgeException(ErrorCode.NOT_FOUND, "User not found", HttpStatus.NOT_FOUND);
        }

        if (organizationMemberRepository.existsByOrganizationIdAndUserId(orgId, req.userId())) {
            throw new CivicForgeException(ErrorCode.CONFLICT, "User is already a member", HttpStatus.CONFLICT);
        }

        OrganizationMember member = OrganizationMember.builder()
            .organizationId(orgId)
            .userId(req.userId())
            .role(req.role())
            .status("ACTIVE")
            .build();

        organizationMemberRepository.save(member);
        auditService.audit("ORG_ADD_MEMBER", "ORGANIZATION_MEMBER", member.getId().toString(), "SUCCESS", null);

        return OrganizationMemberDto.from(member);
    }

    public void removeMember(UUID orgId, UUID userId, UUID actorId) {
        OrganizationMember member = organizationMemberRepository.findByOrganizationIdAndUserId(orgId, userId)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.NOT_FOUND, "Membership not found", HttpStatus.NOT_FOUND));

        member.setStatus("INACTIVE");
        organizationMemberRepository.save(member);
        auditService.audit("ORG_REMOVE_MEMBER", "ORGANIZATION_MEMBER", member.getId().toString(), "SUCCESS", null);
    }

    public List<OrganizationDto> getUserOrganizations(UUID userId) {
        List<OrganizationMember> memberships = organizationMemberRepository.findByUserIdAndStatus(userId, "ACTIVE");
        return memberships.stream()
            .map(m -> organizationRepository.findById(m.getOrganizationId()).orElse(null))
            .filter(org -> org != null && org.isActive())
            .map(OrganizationDto::from)
            .collect(Collectors.toList());
    }
}
