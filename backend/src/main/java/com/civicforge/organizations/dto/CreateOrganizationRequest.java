package com.civicforge.organizations.dto;

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
