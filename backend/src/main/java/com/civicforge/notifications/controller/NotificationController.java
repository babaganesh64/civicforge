package com.civicforge.notifications.controller;

import com.civicforge.common.dto.ApiResponse;
import com.civicforge.identity.security.CivicForgeUserDetails;
import com.civicforge.notifications.dto.NotificationDto;
import com.civicforge.notifications.entity.Notification;
import com.civicforge.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(
            @AuthenticationPrincipal CivicForgeUserDetails principal) {
        
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(principal.getUserId());
        List<NotificationDto> dtos = notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(ApiResponse.success(dtos, "Notifications retrieved successfully"));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable UUID id,
            @AuthenticationPrincipal CivicForgeUserDetails principal) {
            
        return notificationRepository.findById(id)
                .filter(n -> n.getUserId().equals(principal.getUserId()))
                .map(n -> {
                    n.setReadAt(Instant.now());
                    notificationRepository.save(n);
                    return ResponseEntity.ok(ApiResponse.success((Void) null, "Notification marked as read"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal CivicForgeUserDetails principal) {
            
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(principal.getUserId()).stream()
                .filter(n -> n.getReadAt() == null)
                .collect(Collectors.toList());
                
        Instant now = Instant.now();
        unread.forEach(n -> n.setReadAt(now));
        notificationRepository.saveAll(unread);
        
        return ResponseEntity.ok(ApiResponse.success((Void) null, "All notifications marked as read"));
    }

    private NotificationDto toDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getType(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getTargetUrl(),
                notification.getReadAt(),
                notification.getCreatedAt()
        );
    }
}
