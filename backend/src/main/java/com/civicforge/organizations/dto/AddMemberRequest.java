package com.civicforge.organizations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AddMemberRequest(
    @NotNull
    UUID userId,

    @NotBlank
    String role
) {}
