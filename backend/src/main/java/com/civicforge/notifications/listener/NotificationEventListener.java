package com.civicforge.notifications.listener;

import com.civicforge.common.events.ChallengeStatusChangedEvent;
import com.civicforge.notifications.entity.Notification;
import com.civicforge.notifications.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationRepository notificationRepository;

    @Async
    @EventListener
    public void handleChallengeStatusChangedEvent(ChallengeStatusChangedEvent event) {
        log.info("Handling ChallengeStatusChangedEvent for challenge: {}", event.getChallengeId());
        
        Notification notification = Notification.builder()
            .userId(event.getOwnerId())
            .type("CHALLENGE_STATUS_UPDATE")
            .title("Challenge Status Updated")
            .message(String.format("Your challenge status changed from %s to %s", event.getOldStatus(), event.getNewStatus()))
            .targetUrl("/challenges/" + event.getChallengeId())
            .build();
            
        notificationRepository.save(notification);
    }
}
