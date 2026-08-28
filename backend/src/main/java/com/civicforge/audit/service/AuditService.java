package com.civicforge.audit.service;

import com.civicforge.audit.entity.AuditEvent;
import com.civicforge.audit.repository.AuditEventRepository;
import com.civicforge.common.audit.AuditContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditEventRepository auditEventRepository;
    private final ObjectMapper objectMapper;

    @Async
    public void audit(String action, String targetType, String targetId, String result, Map<String, Object> metadata) {
        try {
            AuditEvent event = new AuditEvent();
            event.setAction(action);
            event.setTargetType(targetType);
            event.setTargetId(targetId);
            event.setResult(result);
            
            if (metadata != null && !metadata.isEmpty()) {
                event.setMetadata(objectMapper.writeValueAsString(metadata));
            }

            AuditContext.Context ctx = AuditContext.get();
            if (ctx != null) {
                event.setActorId(ctx.actorId() != null ? ctx.actorId().toString() : null);
                event.setActorEmail(ctx.actorEmail());
                event.setActorOrgId(ctx.orgId() != null ? ctx.orgId().toString() : null);
                event.setRequestId(ctx.requestId());
            }

            auditEventRepository.save(event);
        } catch (Exception e) {
            log.error("Failed to persist audit event", e);
        }
    }
}