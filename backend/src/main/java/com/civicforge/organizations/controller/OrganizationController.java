package com.civicforge.organizations.controller;

import com.civicforge.common.dto.ApiResponse;
import com.civicforge.common.dto.PageResponse;
import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.organizations.dto.AddMemberRequest;
import com.civicforge.organizations.dto.CreateOrganizationRequest;
import com.civicforge.organizations.dto.OrganizationDto;
import com.civicforge.organizations.dto.OrganizationMemberDto;
import com.civicforge.organizations.entity.OrganizationMember;
import com.civicforge.organizations.repository.OrganizationMemberRepository;
import com.civicforge.organizations.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/organizations")
@Slf4j
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;
    private final OrganizationMemberRepository organizationMemberRepository;

    @GetMapping
    public PageResponse<OrganizationDto> listOrganizations(
            @RequestParam(required = false) String orgType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<OrganizationDto> orgPage = organizationService.listOrganizations(orgType, PageRequest.of(page, size));
        return PageResponse.of(orgPage);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','GOVERNMENT_MANAGER')")
    public ApiResponse<OrganizationDto> createOrganization(@Valid @RequestBody CreateOrganizationRequest request) {
        UUID actorId = getActorId();
        return ApiResponse.success(organizationService.createOrganization(request, actorId));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrganizationDto> getOrganization(@PathVariable UUID id) {
        return ApiResponse.success(organizationService.getOrganization(id));
    }

    @GetMapping("/{id}/members")
    @PreAuthorize("@organizationSecurity.isMember(#id, principal.userId) or hasRole('PLATFORM_ADMIN')")
    public ApiResponse<List<OrganizationMemberDto>> getMembers(@PathVariable UUID id) {
        List<OrganizationMemberDto> members = organizationMemberRepository.findByOrganizationIdAndStatus(id, "ACTIVE")
            .stream().map(OrganizationMemberDto::from).collect(Collectors.toList());
        return ApiResponse.success(members);
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','GOVERNMENT_MANAGER','UNIVERSITY_ADMIN','INDUSTRY_ADMIN')")
    public ApiResponse<OrganizationMemberDto> addMember(@PathVariable UUID id, @Valid @RequestBody AddMemberRequest request) {
        UUID actorId = getActorId();
        return ApiResponse.success(organizationService.addMember(id, request, actorId));
    }

    @DeleteMapping("/{id}/members/{userId}")
    @PreAuthorize("hasAnyRole('PLATFORM_ADMIN','GOVERNMENT_MANAGER','UNIVERSITY_ADMIN','INDUSTRY_ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(@PathVariable UUID id, @PathVariable UUID userId) {
        UUID actorId = getActorId();
        organizationService.removeMember(id, userId, actorId);
    }

    @GetMapping("/my")
    public ApiResponse<List<OrganizationDto>> getMyOrganizations() {
        UUID actorId = getActorId();
        return ApiResponse.success(organizationService.getUserOrganizations(actorId));
    }

    private UUID getActorId() {
        CivicForgeUserDetails principal = (CivicForgeUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getUserId();
    }
}
