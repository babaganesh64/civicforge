import os

BASE_DIR = '/Users/babaganesh/civicforge/backend/src/main/java/com/civicforge'

files = {
    'users/entity/User.java': '''package com.civicforge.users.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "user_type", nullable = false)
    private String userType;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Column(name = "identity_verified")
    private boolean identityVerified;

    @Column(name = "identity_verification_reference")
    private String identityVerificationReference;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
''',

    'users/entity/CitizenProfile.java': '''package com.civicforge.users.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "citizen_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CitizenProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    @Column(name = "address_line1")
    private String addressLine1;

    private String city;

    @Column(name = "state")
    private String state;

    private String pincode;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
''',

    'users/repository/UserRepository.java': '''package com.civicforge.users.repository;

import com.civicforge.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByIdAndStatus(UUID id, String status);
}
''',

    'users/repository/CitizenProfileRepository.java': '''package com.civicforge.users.repository;

import com.civicforge.users.entity.CitizenProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, UUID> {
    Optional<CitizenProfile> findByUserId(UUID userId);
}
''',

    'users/dto/UserDto.java': '''package com.civicforge.users.dto;

import com.civicforge.users.entity.User;
import java.time.Instant;
import java.util.UUID;

public record UserDto(
    UUID id,
    String email,
    String displayName,
    String userType,
    String status,
    boolean emailVerified,
    boolean identityVerified,
    Instant createdAt,
    Instant lastLoginAt
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getEmail(),
            user.getDisplayName(),
            user.getUserType(),
            user.getStatus(),
            user.isEmailVerified(),
            user.isIdentityVerified(),
            user.getCreatedAt(),
            user.getLastLoginAt()
        );
    }
}
''',

    'users/dto/UpdateProfileRequest.java': '''package com.civicforge.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @NotBlank
    @Size(max = 255)
    String displayName
) {}
''',

    'identity/service/UserDetailsServiceImpl.java': '''package com.civicforge.identity.service;

import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.users.entity.User;
import com.civicforge.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new CivicForgeUserDetails(
            user.getId(),
            user.getEmail(),
            user.getPasswordHash(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getUserType())),
            "ACTIVE".equals(user.getStatus())
        );
    }
}
''',

    'identity/dto/RegisterRequest.java': '''package com.civicforge.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
    @NotBlank
    @Email
    String email,

    @NotBlank
    @Size(min = 8, max = 100)
    String password,

    @NotBlank
    @Size(min = 2, max = 255)
    String displayName,

    @NotNull
    String userType
) {}
''',

    'identity/dto/LoginRequest.java': '''package com.civicforge.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank
    @Email
    String email,

    @NotBlank
    String password
) {}
''',

    'identity/dto/AuthResponse.java': '''package com.civicforge.identity.dto;

import com.civicforge.users.dto.UserDto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    long expiresIn,
    UserDto user
) {}
''',

    'identity/dto/RefreshRequest.java': '''package com.civicforge.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
    @NotBlank
    String refreshToken
) {}
''',

    'identity/service/AuthService.java': '''package com.civicforge.identity.service;

import com.civicforge.audit.service.AuditService;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.identity.dto.AuthResponse;
import com.civicforge.identity.dto.LoginRequest;
import com.civicforge.identity.dto.RefreshRequest;
import com.civicforge.identity.dto.RegisterRequest;
import com.civicforge.identity.security.JwtTokenProvider;
import com.civicforge.users.dto.UserDto;
import com.civicforge.users.entity.CitizenProfile;
import com.civicforge.users.entity.User;
import com.civicforge.users.repository.CitizenProfileRepository;
import com.civicforge.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationInMs;

    private static final List<String> ALLOWED_REGISTRATION_ROLES = List.of(
        "CITIZEN", "UNIVERSITY_ADMIN", "UNIVERSITY_MEMBER", "INDUSTRY_ADMIN", "INDUSTRY_MEMBER"
    );

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new CivicForgeException(ErrorCode.USER_ALREADY_EXISTS, "Email already registered", HttpStatus.CONFLICT);
        }

        if (!ALLOWED_REGISTRATION_ROLES.contains(req.userType())) {
            throw new CivicForgeException(ErrorCode.VALIDATION_ERROR, "Invalid user type for registration", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
            .email(req.email())
            .passwordHash(passwordEncoder.encode(req.password()))
            .displayName(req.displayName())
            .userType(req.userType())
            .status("ACTIVE")
            .emailVerified(false)
            .build();

        userRepository.save(user);

        if ("CITIZEN".equals(user.getUserType())) {
            CitizenProfile profile = CitizenProfile.builder()
                .userId(user.getId())
                .fullName(user.getDisplayName())
                .build();
            citizenProfileRepository.save(profile);
        }

        auditService.audit("USER_REGISTER", "USER", user.getId().toString(), "SUCCESS", Map.of("email", user.getEmail(), "userType", user.getUserType()));

        return generateAuthResponse(user);
    }

    public AuthResponse login(LoginRequest req, String ipAddress) {
        User user = userRepository.findByEmail(req.email())
            .orElseThrow(() -> new CivicForgeException(ErrorCode.UNAUTHORIZED, "Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new CivicForgeException(ErrorCode.UNAUTHORIZED, "Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new CivicForgeException(ErrorCode.FORBIDDEN, "User account is not active", HttpStatus.FORBIDDEN);
        }

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        auditService.audit("USER_LOGIN", "USER", user.getId().toString(), "SUCCESS", Map.of("ipAddress", ipAddress != null ? ipAddress : "unknown"));

        return generateAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CivicForgeException(ErrorCode.UNAUTHORIZED, "Invalid refresh token", HttpStatus.UNAUTHORIZED);
        }

        UUID userId = jwtTokenProvider.getUserIdFromJWT(refreshToken);
        User user = userRepository.findByIdAndStatus(userId, "ACTIVE")
            .orElseThrow(() -> new CivicForgeException(ErrorCode.UNAUTHORIZED, "User not found or inactive", HttpStatus.UNAUTHORIZED));

        String accessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), "ROLE_" + user.getUserType());
        
        return new AuthResponse(accessToken, refreshToken, jwtExpirationInMs, UserDto.from(user));
    }

    public UserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.NOT_FOUND, "User not found", HttpStatus.NOT_FOUND));
        return UserDto.from(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), "ROLE_" + user.getUserType());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        return new AuthResponse(accessToken, refreshToken, jwtExpirationInMs, UserDto.from(user));
    }
}
''',

    'identity/controller/AuthController.java': '''package com.civicforge.identity.controller;

import com.civicforge.common.dto.ApiResponse;
import com.civicforge.identity.dto.AuthResponse;
import com.civicforge.identity.dto.LoginRequest;
import com.civicforge.identity.dto.RefreshRequest;
import com.civicforge.identity.dto.RegisterRequest;
import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.identity.service.AuthService;
import com.civicforge.users.dto.UserDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        return ApiResponse.success(authService.login(request, ipAddress));
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ApiResponse.success(authService.refreshToken(request.refreshToken()));
    }

    @GetMapping("/me")
    public ApiResponse<UserDto> getCurrentUser() {
        CivicForgeUserDetails principal = (CivicForgeUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ApiResponse.success(authService.getCurrentUser(principal.getUserId()));
    }
}
''',

    'identity/config/PasswordConfig.java': '''package com.civicforge.identity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
''',

    'organizations/entity/Organization.java': '''package com.civicforge.organizations.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "org_type", nullable = false)
    private String orgType;

    @Column(name = "verification_status", nullable = false)
    @Builder.Default
    private String verificationStatus = "PENDING";

    private String website;

    private String description;

    private String geography;

    @Column(columnDefinition = "jsonb")
    private String domains;

    @Column(columnDefinition = "jsonb")
    private String capabilities;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(columnDefinition = "jsonb")
    private String metadata;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
''',

    'organizations/entity/OrganizationMember.java': '''package com.civicforge.organizations.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "organization_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationMember {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    @PrePersist
    protected void onCreate() {
        this.joinedAt = Instant.now();
    }
}
''',

    'organizations/repository/OrganizationRepository.java': '''package com.civicforge.organizations.repository;

import com.civicforge.organizations.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    Page<Organization> findByOrgTypeAndActive(String orgType, boolean active, Pageable pageable);
    List<Organization> findByActive(boolean active);
}
''',

    'organizations/repository/OrganizationMemberRepository.java': '''package com.civicforge.organizations.repository;

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
''',

    'organizations/dto/OrganizationDto.java': '''package com.civicforge.organizations.dto;

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
''',

    'organizations/dto/OrganizationMemberDto.java': '''package com.civicforge.organizations.dto;

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
''',

    'organizations/dto/CreateOrganizationRequest.java': '''package com.civicforge.organizations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateOrganizationRequest(
    @NotBlank
    @Size(max = 255)
    String name,

    String shortName,

    @NotBlank
    String orgType,

    String website,
    String description,
    String geography,
    String contactEmail,
    String contactPhone
) {}
''',

    'organizations/dto/AddMemberRequest.java': '''package com.civicforge.organizations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddMemberRequest(
    @NotNull
    UUID userId,

    @NotBlank
    String role
) {}
''',

    'organizations/service/OrganizationService.java': '''package com.civicforge.organizations.service;

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
''',

    'organizations/controller/OrganizationController.java': '''package com.civicforge.organizations.controller;

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
        return PageResponse.success(orgPage);
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
''',

    'organizations/security/OrganizationSecurity.java': '''package com.civicforge.organizations.security;

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
''',

    'users/controller/UserController.java': '''package com.civicforge.users.controller;

import com.civicforge.audit.service.AuditService;
import com.civicforge.common.dto.ApiResponse;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.users.dto.UpdateProfileRequest;
import com.civicforge.users.dto.UserDto;
import com.civicforge.users.entity.User;
import com.civicforge.users.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AuditService auditService;

    @PatchMapping("/me/profile")
    @Transactional
    public ApiResponse<UserDto> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        CivicForgeUserDetails principal = (CivicForgeUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UUID userId = principal.getUserId();

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new CivicForgeException(ErrorCode.NOT_FOUND, "User not found", HttpStatus.NOT_FOUND));

        user.setDisplayName(request.displayName());
        userRepository.save(user);

        auditService.audit("USER_UPDATE_PROFILE", "USER", userId.toString(), "SUCCESS", null);

        return ApiResponse.success(UserDto.from(user));
    }
}
'''
}

for rel_path, content in files.items():
    full_path = os.path.join(BASE_DIR, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
    print(f"Created {full_path}")
