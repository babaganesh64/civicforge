package com.civicforge.users.dto;

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
