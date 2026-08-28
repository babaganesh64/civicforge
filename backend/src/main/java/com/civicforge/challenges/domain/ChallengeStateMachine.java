package com.civicforge.challenges.domain;

import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

import java.util.List;

import static com.civicforge.challenges.domain.ChallengeAction.*;
import static com.civicforge.challenges.domain.ChallengeStatus.*;

public class ChallengeStateMachine {

    private record Transition(ChallengeStatus from, ChallengeAction action, ChallengeStatus to) {}

    private static final List<Transition> TRANSITIONS = List.of(
        new Transition(DRAFT, SUBMIT, SUBMITTED),
        new Transition(SUBMITTED, START_REVIEW, UNDER_REVIEW),
        new Transition(UNDER_REVIEW, REQUEST_CLARIFICATION, CLARIFICATION_REQUIRED),
        new Transition(UNDER_REVIEW, VERIFY, VERIFIED),
        new Transition(UNDER_REVIEW, REJECT, REJECTED),
        new Transition(CLARIFICATION_REQUIRED, RESUBMIT, UNDER_REVIEW),
        new Transition(VERIFIED, CLASSIFY, CLASSIFIED),
        new Transition(CLASSIFIED, PRIORITIZE, PRIORITIZED),
        new Transition(PRIORITIZED, ROUTE, ROUTED),
        new Transition(PRIORITIZED, PUBLISH, PUBLISHED),
        new Transition(ROUTED, EXPRESS_INTEREST, INTERESTED),
        new Transition(PUBLISHED, EXPRESS_INTEREST, INTERESTED),
        new Transition(INTERESTED, ACCEPT, ACCEPTED),
        new Transition(ACCEPTED, FORM_PROJECT, PROJECT_FORMED),
        new Transition(PROJECT_FORMED, START_PROGRESS, IN_PROGRESS),
        new Transition(IN_PROGRESS, BEGIN_PILOT, PILOT),
        new Transition(PILOT, DEPLOY, DEPLOYED),
        new Transition(DEPLOYED, MEASURE_IMPACT, IMPACT_MEASURED),
        new Transition(IMPACT_MEASURED, CLOSE, CLOSED),
        new Transition(CLOSED, ARCHIVE, ARCHIVED),
        new Transition(VERIFIED, ARCHIVE, ARCHIVED),
        new Transition(REJECTED, ARCHIVE, ARCHIVED)
    );

    public static ChallengeStatus transition(ChallengeStatus current, ChallengeAction action) {
        return TRANSITIONS.stream()
            .filter(t -> t.from() == current && t.action() == action)
            .map(Transition::to)
            .findFirst()
            .orElseThrow(() -> new CivicForgeException(
                ErrorCode.CHALLENGE_INVALID_TRANSITION,
                "Cannot perform " + action + " on challenge in state " + current,
                HttpStatus.CONFLICT
            ));
    }

    public static List<ChallengeAction> validActions(ChallengeStatus current) {
        return TRANSITIONS.stream()
            .filter(t -> t.from() == current)
            .map(Transition::action)
            .toList();
    }
}
