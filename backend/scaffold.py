import os

BASE_DIR = '/Users/babaganesh/civicforge/backend'

files = {
    'pom.xml': """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.civicforge</groupId>
    <artifactId>civicforge-backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>civicforge-backend</name>
    <description>CivicForge Backend</description>
    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
        <springdoc.version>2.5.0</springdoc.version>
        <testcontainers.version>1.19.7</testcontainers.version>
        <bucket4j.version>8.10.1</bucket4j.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>${springdoc.version}</version>
        </dependency>
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-prometheus</artifactId>
        </dependency>
        <dependency>
            <groupId>com.github.ben-manes.caffeine</groupId>
            <artifactId>caffeine</artifactId>
        </dependency>
        <dependency>
            <groupId>com.bucket4j</groupId>
            <artifactId>bucket4j-core</artifactId>
            <version>${bucket4j.version}</version>
        </dependency>
        <dependency>
            <groupId>com.bucket4j</groupId>
            <artifactId>bucket4j-redis</artifactId>
            <version>${bucket4j.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>postgresql</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>junit-jupiter</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.testcontainers</groupId>
                <artifactId>testcontainers-bom</artifactId>
                <version>${testcontainers.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>""",
    
    'src/main/java/com/civicforge/CivicForgeApplication.java': """package com.civicforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
public class CivicForgeApplication {
    public static void main(String[] args) {
        SpringApplication.run(CivicForgeApplication.class, args);
    }
}""",
    
    'src/main/resources/application.yml': """spring:
  application:
    name: civicforge-backend
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/civicforge}
    username: ${DATABASE_USERNAME:civicforge}
    password: ${DATABASE_PASSWORD:civicforge}
    hikari:
      maximum-pool-size: ${DB_POOL_SIZE:20}
      minimum-idle: 5
      connection-timeout: 30000
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: false
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
  cache:
    type: redis

server:
  port: 8080
  servlet:
    context-path: /

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when_authorized
  metrics:
    export:
      prometheus:
        enabled: true

app:
  jwt:
    secret: ${JWT_SECRET:change-me-in-production-must-be-256-bits-long-at-minimum}
    expiration-ms: ${JWT_EXPIRATION_MS:900000}
    refresh-expiration-ms: ${JWT_REFRESH_EXPIRATION_MS:604800000}
  cors:
    allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000}
  ai:
    service-url: ${AI_SERVICE_URL:http://localhost:8000}
    enabled: ${AI_ENABLED:false}
    timeout-ms: ${AI_TIMEOUT_MS:10000}

logging:
  pattern:
    console: '%d{yyyy-MM-dd HH:mm:ss} [%thread] [%X{requestId}] %-5level %logger{36} - %msg%n'
  level:
    root: INFO
    com.civicforge: DEBUG""",
    
    'src/main/resources/application-test.yml': """spring:
  datasource:
    url: jdbc:tc:postgresql:16:///civicforge_test
    driver-class-name: org.testcontainers.jdbc.ContainerDatabaseDriver
  jpa:
    hibernate:
      ddl-auto: create-drop
  flyway:
    enabled: true
  data:
    redis:
      host: localhost
      port: 6379
app:
  jwt:
    secret: test-secret-key-that-is-long-enough-for-testing-purposes-only
    expiration-ms: 3600000
    refresh-expiration-ms: 86400000""",
    
    'src/main/java/com/civicforge/common/dto/ApiResponse.java': """package com.civicforge.common.dto;

public record ApiResponse<T>(T data, String message, boolean success) {
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(data, "Success", true);
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(data, message, true);
    }
}""",
    
    'src/main/java/com/civicforge/common/dto/PageResponse.java': """package com.civicforge.common.dto;

import org.springframework.data.domain.Page;
import java.util.List;

public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isFirst(),
            page.isLast()
        );
    }
}""",
    
    'src/main/java/com/civicforge/common/exception/CivicForgeException.java': """package com.civicforge.common.exception;

import org.springframework.http.HttpStatus;

public class CivicForgeException extends RuntimeException {
    private final String errorCode;
    private final HttpStatus httpStatus;
    
    public CivicForgeException(String errorCode, String message, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}""",
    
    'src/main/java/com/civicforge/common/exception/ErrorCode.java': """package com.civicforge.common.exception;

public interface ErrorCode {
    String VALIDATION_ERROR = "VALIDATION_ERROR";
    String UNAUTHORIZED = "UNAUTHORIZED";
    String FORBIDDEN = "FORBIDDEN";
    String NOT_FOUND = "NOT_FOUND";
    String CONFLICT = "CONFLICT";
    String INVALID_STATE = "INVALID_STATE";
    String RATE_LIMITED = "RATE_LIMITED";
    String DEPENDENCY_UNAVAILABLE = "DEPENDENCY_UNAVAILABLE";
    String INTERNAL_ERROR = "INTERNAL_ERROR";
    String CHALLENGE_NOT_FOUND = "CHALLENGE_NOT_FOUND";
    String CHALLENGE_INVALID_STATE = "CHALLENGE_INVALID_STATE";
    String CHALLENGE_INVALID_TRANSITION = "CHALLENGE_INVALID_TRANSITION";
    String USER_NOT_FOUND = "USER_NOT_FOUND";
    String USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS";
    String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    String ORG_NOT_FOUND = "ORG_NOT_FOUND";
    String ORG_ACCESS_DENIED = "ORG_ACCESS_DENIED";
    String FILE_TOO_LARGE = "FILE_TOO_LARGE";
    String FILE_TYPE_NOT_ALLOWED = "FILE_TYPE_NOT_ALLOWED";
    String BULK_JOB_NOT_FOUND = "BULK_JOB_NOT_FOUND";
    String BULK_PERMISSION_DENIED = "BULK_PERMISSION_DENIED";
    String AI_SERVICE_UNAVAILABLE = "AI_SERVICE_UNAVAILABLE";
}""",
    
    'src/main/java/com/civicforge/common/exception/GlobalExceptionHandler.java': """package com.civicforge.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.Map;
import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CivicForgeException.class)
    public ResponseEntity<Map<String, Object>> handleCivicForgeException(CivicForgeException ex) {
        log.error("CivicForge error: [{}] {}", ex.getErrorCode(), ex.getMessage());
        return buildErrorResponse(ex.getErrorCode(), ex.getMessage(), ex.getHttpStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .reduce((a, b) -> a + ", " + b).orElse(ex.getMessage());
        return buildErrorResponse(ErrorCode.VALIDATION_ERROR, message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        return buildErrorResponse(ErrorCode.VALIDATION_ERROR, ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNoSuchElementException(NoSuchElementException ex) {
        return buildErrorResponse(ErrorCode.NOT_FOUND, ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return buildErrorResponse(ErrorCode.CONFLICT, "Data integrity violation", HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return buildErrorResponse(ErrorCode.FORBIDDEN, ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex) {
        return buildErrorResponse(ErrorCode.UNAUTHORIZED, ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        log.error("Unhandled exception: ", ex);
        return buildErrorResponse(ErrorCode.INTERNAL_ERROR, "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(String code, String message, HttpStatus status) {
        Map<String, Object> body = Map.of(
                "code", code,
                "message", message != null ? message : "Error",
                "requestId", MDC.get("requestId") != null ? MDC.get("requestId") : "",
                "timestamp", Instant.now().toString()
        );
        return new ResponseEntity<>(body, status);
    }
}""",
    
    'src/main/java/com/civicforge/common/web/RequestIdFilter.java': """package com.civicforge.common.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.UUID;

@Component
public class RequestIdFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String MDC_KEY = "requestId";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        if (requestId == null || requestId.isEmpty()) {
            requestId = UUID.randomUUID().toString();
        }
        
        MDC.put(MDC_KEY, requestId);
        response.setHeader(REQUEST_ID_HEADER, requestId);
        
        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove(MDC_KEY);
        }
    }
}""",

    'src/main/java/com/civicforge/common/audit/AuditContext.java': """package com.civicforge.common.audit;

import java.util.UUID;

public class AuditContext {
    private static final ThreadLocal<Context> CONTEXT = new ThreadLocal<>();

    public static void set(UUID actorId, String actorEmail, UUID orgId, String requestId) {
        CONTEXT.set(new Context(actorId, actorEmail, orgId, requestId));
    }

    public static Context get() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }

    public record Context(UUID actorId, String actorEmail, UUID orgId, String requestId) {}
}""",
    
    'src/main/java/com/civicforge/audit/entity/AuditEvent.java': """package com.civicforge.audit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
@Getter
@Setter
@NoArgsConstructor
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false)
    private UUID id;

    @Column(name = "actor_id", updatable = false)
    private String actorId;

    @Column(name = "actor_email", updatable = false)
    private String actorEmail;

    @Column(name = "actor_org_id", updatable = false)
    private String actorOrgId;

    @Column(nullable = false, updatable = false)
    private String action;

    @Column(name = "target_type", nullable = false, updatable = false)
    private String targetType;

    @Column(name = "target_id", nullable = false, updatable = false)
    private String targetId;

    @Column(nullable = false, updatable = false)
    private String result;

    @Column(name = "request_id", updatable = false)
    private String requestId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(columnDefinition = "jsonb", updatable = false)
    private String metadata;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}""",
    
    'src/main/java/com/civicforge/audit/repository/AuditEventRepository.java': """package com.civicforge.audit.repository;

import com.civicforge.audit.entity.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    Page<AuditEvent> findByTargetTypeAndTargetIdOrderByCreatedAtDesc(String targetType, String targetId, Pageable pageable);
    Page<AuditEvent> findByActorIdOrderByCreatedAtDesc(String actorId, Pageable pageable);
}""",

    'src/main/java/com/civicforge/audit/service/AuditService.java': """package com.civicforge.audit.service;

import com.civicforge.audit.entity.AuditEvent;
import com.civicforge.audit.repository.AuditEventRepository;
import com.civicforge.common.audit.AuditContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditEventRepository auditEventRepository;
    private final ObjectMapper objectMapper;

    @Async
    public void audit(String action, String targetType, String targetId, String result, Map<String, Object> metadata) {
        try {
            AuditEvent event = new AuditEvent();
            event.setAction(action);
            event.setTargetType(targetType);
            event.setTargetId(targetId);
            event.setResult(result);
            
            if (metadata != null && !metadata.isEmpty()) {
                event.setMetadata(objectMapper.writeValueAsString(metadata));
            }

            AuditContext.Context ctx = AuditContext.get();
            if (ctx != null) {
                event.setActorId(ctx.actorId() != null ? ctx.actorId().toString() : null);
                event.setActorEmail(ctx.actorEmail());
                event.setActorOrgId(ctx.orgId() != null ? ctx.orgId().toString() : null);
                event.setRequestId(ctx.requestId());
            }

            auditEventRepository.save(event);
        } catch (Exception e) {
            log.error("Failed to persist audit event", e);
        }
    }
}""",
    
    'src/main/resources/db/migration/V1__init_schema.sql': """-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL, -- CITIZEN, UNIVERSITY_ADMIN, etc.
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    identity_verified BOOLEAN NOT NULL DEFAULT FALSE,
    identity_verification_reference VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Citizen profiles
CREATE TABLE citizen_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    org_type VARCHAR(50) NOT NULL, -- GOVERNMENT, UNIVERSITY, INDUSTRY
    verification_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    website VARCHAR(500),
    description TEXT,
    geography VARCHAR(255),
    domains JSONB,
    capabilities JSONB,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    metadata JSONB,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization members
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL, -- GOVERNMENT_REVIEWER, GOVERNMENT_MANAGER, UNIVERSITY_ADMIN, etc.
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Challenges
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    sub_category VARCHAR(100),
    location_description VARCHAR(500),
    state_province VARCHAR(100),
    city VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    affected_population_estimate INTEGER,
    affected_population_notes TEXT,
    urgency VARCHAR(50),
    expected_outcome TEXT,
    consent_given BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    priority VARCHAR(50),
    submitted_by UUID NOT NULL REFERENCES users(id),
    submitted_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    clarification_request TEXT,
    tags JSONB,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenge evidence (file attachments)
CREATE TABLE challenge_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    file_id UUID NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    description TEXT,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Challenge AI analysis
CREATE TABLE challenge_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    job_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    suggested_category VARCHAR(100),
    suggested_priority VARCHAR(50),
    summary TEXT,
    tags JSONB,
    similarity_candidates JSONB,
    suggested_organizations JSONB,
    explanation TEXT,
    confidence_score DECIMAL(5,4),
    model_id VARCHAR(100),
    model_version VARCHAR(50),
    -- Human override fields
    human_override BOOLEAN NOT NULL DEFAULT FALSE,
    override_by UUID REFERENCES users(id),
    override_at TIMESTAMPTZ,
    override_notes TEXT,
    -- Timestamps
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    raw_response JSONB
);

-- Challenge assignments
CREATE TABLE challenge_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    assigned_by UUID NOT NULL REFERENCES users(id),
    assignment_type VARCHAR(50) NOT NULL, -- PRIMARY, COLLABORATOR
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    UNIQUE(challenge_id, organization_id)
);

-- Challenge history (audit trail)
CREATE TABLE challenge_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES users(id),
    actor_email VARCHAR(255),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- File metadata
CREATE TABLE file_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    original_filename VARCHAR(500) NOT NULL,
    stored_key VARCHAR(1000) NOT NULL UNIQUE,
    bucket_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum VARCHAR(128),
    status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED',
    purpose VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES challenges(id),
    lead_organization_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    health VARCHAR(50) DEFAULT 'ON_TRACK',
    start_date DATE,
    expected_end_date DATE,
    actual_end_date DATE,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project members
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(100) NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id),
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    progress_percent INTEGER DEFAULT 0,
    blockers TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deliverables
CREATE TABLE deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    file_id UUID REFERENCES file_metadata(id),
    submitted_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Collaboration requests
CREATE TABLE collaboration_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id),
    project_id UUID REFERENCES projects(id),
    requesting_org_id UUID NOT NULL REFERENCES organizations(id),
    target_org_id UUID REFERENCES organizations(id),
    type VARCHAR(50) NOT NULL, -- INTEREST, OFFER, REQUEST
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Impact metrics
CREATE TABLE impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15,4),
    metric_unit VARCHAR(100),
    description TEXT,
    recorded_by UUID NOT NULL REFERENCES users(id),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    target_url VARCHAR(1000),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bulk operations
CREATE TABLE bulk_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES users(id),
    actor_org_id UUID REFERENCES organizations(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    requested_count INTEGER NOT NULL DEFAULT 0,
    processed_count INTEGER NOT NULL DEFAULT 0,
    succeeded_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    skipped_count INTEGER NOT NULL DEFAULT 0,
    parameters JSONB,
    failure_summary JSONB,
    audit_reference UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Bulk operation items
CREATE TABLE bulk_operation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulk_operation_id UUID NOT NULL REFERENCES bulk_operations(id) ON DELETE CASCADE,
    resource_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    error_code VARCHAR(100),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    processed_at TIMESTAMPTZ,
    metadata JSONB
);

-- Audit events (append-only)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(255),
    actor_email VARCHAR(255),
    actor_org_id VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id VARCHAR(255) NOT NULL,
    result VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    request_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_priority ON challenges(priority);
CREATE INDEX idx_challenges_category ON challenges(category);
CREATE INDEX idx_challenges_submitted_by ON challenges(submitted_by);
CREATE INDEX idx_challenges_created_at ON challenges(created_at);
CREATE INDEX idx_challenges_updated_at ON challenges(updated_at);
CREATE INDEX idx_challenges_status_priority ON challenges(status, priority);
CREATE INDEX idx_challenge_assignments_org_id ON challenge_assignments(organization_id, status);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_lead_org ON projects(lead_organization_id, status);
CREATE INDEX idx_milestones_due_date ON milestones(due_date, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read_at);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_audit_events_target ON audit_events(target_type, target_id, created_at DESC);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_id, created_at DESC);
CREATE INDEX idx_org_members_user ON organization_members(user_id, status);
CREATE INDEX idx_org_members_org ON organization_members(organization_id, status);
CREATE INDEX idx_bulk_items_operation ON bulk_operation_items(bulk_operation_id, status);
CREATE INDEX idx_file_metadata_owner ON file_metadata(owner_id);

-- Full-text search index on challenges
CREATE INDEX idx_challenges_fts ON challenges USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, ''))
);

-- Trigram index for fuzzy title search
CREATE INDEX idx_challenges_title_trgm ON challenges USING GIN (title gin_trgm_ops);""",

    'src/main/java/com/civicforge/identity/security/JwtTokenProvider.java': """package com.civicforge.identity.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;
    private final long jwtExpirationInMs;
    private final long refreshExpirationInMs;

    public JwtTokenProvider(@Value("${app.jwt.secret}") String jwtSecret,
                            @Value("${app.jwt.expiration-ms}") long jwtExpirationInMs,
                            @Value("${app.jwt.refresh-expiration-ms}") long refreshExpirationInMs) {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        if(keyBytes.length < 32) {
            // pad if less than 256 bits (32 bytes)
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            this.key = Keys.hmacShaKeyFor(padded);
        } else {
            this.key = Keys.hmacShaKeyFor(keyBytes);
        }
        this.jwtExpirationInMs = jwtExpirationInMs;
        this.refreshExpirationInMs = refreshExpirationInMs;
    }

    public String generateToken(UUID userId, String email, String roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }
    
    public String generateRefreshToken(UUID userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpirationInMs);

        return Jwts.builder()
                .subject(userId.toString())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public UUID getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return UUID.fromString(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(key).build().parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }
        return false;
    }
}""",

    'src/main/java/com/civicforge/identity/security/JwtAuthFilter.java': """package com.civicforge.identity.security;

import com.civicforge.common.audit.AuditContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    // For simplicity, normally inject UserDetailsService
    // private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                UUID userId = tokenProvider.getUserIdFromJWT(jwt);

                // Ideally fetch full user details. 
                // For this skeleton, we set minimal authentication.
                // UserDetails userDetails = userDetailsService.loadUserByUsername(userId.toString());
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, null);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                // Set Audit Context
                String requestId = MDC.get("requestId");
                AuditContext.set(userId, "unknown@example.com", null, requestId);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            AuditContext.clear();
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}""",

    'src/main/java/com/civicforge/identity/security/SecurityConfig.java': """package com.civicforge.identity.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/actuator/health", "/actuator/info", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}""",

    'src/main/java/com/civicforge/identity/security/UserRole.java': """package com.civicforge.identity.security;

public enum UserRole {
    CITIZEN, 
    UNIVERSITY_ADMIN, 
    UNIVERSITY_PROJECT_MANAGER, 
    UNIVERSITY_MEMBER,
    INDUSTRY_ADMIN, 
    INDUSTRY_MEMBER, 
    GOVERNMENT_REVIEWER, 
    GOVERNMENT_MANAGER, 
    PLATFORM_ADMIN
}""",

    'src/main/java/com/civicforge/identity/security/CivicForgeUserDetails.java': """package com.civicforge.identity.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class CivicForgeUserDetails implements UserDetails {
    
    private final UUID userId;
    private final String email;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean active;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}""",

    'src/main/java/com/civicforge/common/config/OpenApiConfig.java': """package com.civicforge.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(new Info().title("CivicForge API")
                        .version("v1")
                        .description("SIH #43 National Civic Innovation Platform"))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(
                        new Components()
                                .addSecuritySchemes(securitySchemeName,
                                        new SecurityScheme()
                                                .name(securitySchemeName)
                                                .type(SecurityScheme.Type.HTTP)
                                                .scheme("bearer")
                                                .bearerFormat("JWT")
                                )
                );
    }
}""",

    'src/main/java/com/civicforge/common/config/RedisConfig.java': """package com.civicforge.common.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import java.time.Duration;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        ObjectMapper mapper = new ObjectMapper();
        mapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(mapper);
        
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(mapper);

        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(60))
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));
                
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }
}""",

    'src/main/java/com/civicforge/common/config/AsyncConfig.java': """package com.civicforge.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;

@Slf4j
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Bean(name = "taskExecutor")
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("civicforge-async-");
        executor.initialize();
        return executor;
    }

    @Bean(name = "bulkExecutor")
    public Executor bulkExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("civicforge-bulk-");
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (ex, method, params) -> log.error("Unexpected exception occurred invoking async method: {}", method.getName(), ex);
    }
}""",

    'src/test/java/com/civicforge/BaseIntegrationTest.java': """package com.civicforge;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
public abstract class BaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("civicforge_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerPgProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
}"""
}

for filepath, content in files.items():
    full_path = os.path.join(BASE_DIR, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Successfully generated {len(files)} files.")
