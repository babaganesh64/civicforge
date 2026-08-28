package com.civicforge.common.audit;

import java.util.UUID;

public class AuditContext {
    private static final ThreadLocal<Context> CONTEXT = new ThreadLocal<>();

    public static void set(UUID actorId, String actorEmail, UUID orgId, String requestId) {
        CONTEXT.set(new Context(actorId, actorEmail, orgId, requestId));
    }

    public static Context get() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }

    public record Context(UUID actorId, String actorEmail, UUID orgId, String requestId) {}
}