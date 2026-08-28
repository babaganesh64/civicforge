package com.civicforge.notifications.dto;

import java.time.Instant;
import java.util.UUID;

public record NotificationDto(
    UUID id,
    String type,
    String title,
    String message,
    String targetUrl,
    Instant readAt,
    Instant createdAt
) {}
