package com.civicforge.identity.service;

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
