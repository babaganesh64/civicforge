package com.civicforge.challenges.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SubmitChallengeRequest(
    @NotBlank @Size(max = 500) String title,
    @NotBlank String description,
    @NotBlank String category,
    String subCategory,
    String locationDescription,
    String stateProvince,
    String city,
    String pincode,
    BigDecimal latitude,
    BigDecimal longitude,
    Integer affectedPopulationEstimate,
    String affectedPopulationNotes,
    String urgency,
    String expectedOutcome,
    @NotNull Boolean consentGiven
) {}
