package com.civicforge.common.events;

import com.civicforge.challenges.domain.ChallengeStatus;
import org.springframework.context.ApplicationEvent;

import java.util.UUID;

public class ChallengeStatusChangedEvent extends ApplicationEvent {

    private final UUID challengeId;
    private final ChallengeStatus oldStatus;
    private final ChallengeStatus newStatus;
    private final UUID actorId;
    private final UUID ownerId;

    public ChallengeStatusChangedEvent(Object source, UUID challengeId, ChallengeStatus oldStatus, ChallengeStatus newStatus, UUID actorId, UUID ownerId) {
        super(source);
        this.challengeId = challengeId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.actorId = actorId;
        this.ownerId = ownerId;
    }

    public UUID getChallengeId() {
        return challengeId;
    }

    public ChallengeStatus getOldStatus() {
        return oldStatus;
    }

    public ChallengeStatus getNewStatus() {
        return newStatus;
    }

    public UUID getActorId() {
        return actorId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }
}
