package com.civicforge.identity.dto;

import com.civicforge.users.dto.UserDto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    long expiresIn,
    UserDto user
) {}
