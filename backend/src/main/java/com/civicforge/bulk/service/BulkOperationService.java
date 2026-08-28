package com.civicforge.bulk.service;

import com.civicforge.audit.service.AuditService;
import com.civicforge.bulk.dto.BulkJobRequest;
import com.civicforge.bulk.dto.BulkJobResponse;
import com.civicforge.bulk.entity.BulkOperation;
import com.civicforge.bulk.entity.BulkOperationItem;
import com.civicforge.bulk.repository.BulkOperationItemRepository;
import com.civicforge.bulk.repository.BulkOperationRepository;
import com.civicforge.challenges.domain.ChallengeAction;
import com.civicforge.challenges.dto.ReviewActionRequest;
import com.civicforge.challenges.service.ChallengeService;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.identity.security.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BulkOperationService {

    private final BulkOperationRepository bulkOperationRepository;
    private final BulkOperationItemRepository bulkOperationItemRepository;
    private final ChallengeService challengeService;
    private final AuditService auditService;
    
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private BulkOperationService self;

    @Transactional
    public BulkJobResponse submitBulkJob(BulkJobRequest req, UUID actorId, String actorEmail, String actorRole) {
        if (!UserRole.GOVERNMENT_MANAGER.name().equals(actorRole) && !UserRole.PLATFORM_ADMIN.name().equals(actorRole)) {
            throw new CivicForgeException(ErrorCode.BULK_PERMISSION_DENIED, "Access denied", HttpStatus.FORBIDDEN);
        }

        BulkOperation operation = BulkOperation.builder()
                .actorId(actorId)
                .action(req.operationType())
                .resourceType("CHALLENGE")
                .status("PENDING")
                .requestedCount(req.itemIds().size())
                .processedCount(0)
                .succeededCount(0)
                .failedCount(0)
                .skippedCount(0)
                .parameters(req.parameters())
                .build();

        operation = bulkOperationRepository.save(operation);

        UUID operationId = operation.getId();
        List<BulkOperationItem> items = req.itemIds().stream()
                .map(id -> BulkOperationItem.builder()
                        .bulkOperationId(operationId)
                        .resourceId(id.toString())
                        .status("PENDING")
                        .build())
                .collect(Collectors.toList());

        bulkOperationItemRepository.saveAll(items);

        self.processBulkJob(operationId, req, actorId, actorEmail, actorRole);
        
        return new BulkJobResponse(
                operation.getId(),
                operation.getAction(),
                operation.getStatus(),
                operation.getRequestedCount(),
                operation.getSucceededCount(),
                operation.getFailedCount(),
                operation.getCreatedAt(),
                null
        );
    }

    @Async
    @Transactional
    public void processBulkJob(UUID operationId, BulkJobRequest req, UUID actorId, String actorEmail, String actorRole) {
        BulkOperation operation = bulkOperationRepository.findById(operationId).orElseThrow();
        operation.setStatus("IN_PROGRESS");
        operation.setStartedAt(Instant.now());
        bulkOperationRepository.save(operation);

        List<BulkOperationItem> items = bulkOperationItemRepository.findByBulkOperationId(operationId);

        int success = 0;
        int error = 0;

        for (BulkOperationItem item : items) {
            try {
                if ("PUBLISH".equals(req.operationType())) {
                    ReviewActionRequest reviewReq = new ReviewActionRequest(ChallengeAction.PUBLISH, "Bulk Publish", null, null, null);
                    challengeService.performAction(UUID.fromString(item.getResourceId()), reviewReq, actorId, actorEmail, actorRole);
                } else if ("CHANGE_STATUS".equals(req.operationType())) {
                    // Extract new status or action from parameters
                    String actionStr = (String) req.parameters().get("action");
                    ChallengeAction action = ChallengeAction.valueOf(actionStr);
                    ReviewActionRequest reviewReq = new ReviewActionRequest(action, "Bulk Change Status", null, null, null);
                    challengeService.performAction(UUID.fromString(item.getResourceId()), reviewReq, actorId, actorEmail, actorRole);
                }
                
                item.setStatus("SUCCESS");
                item.setProcessedAt(Instant.now());
                success++;
            } catch (Exception e) {
                log.error("Error processing item {}", item.getResourceId(), e);
                item.setStatus("FAILED");
                item.setErrorMessage(e.getMessage());
                item.setProcessedAt(Instant.now());
                error++;
            }
            bulkOperationItemRepository.save(item);
        }

        operation.setProcessedCount(success + error);
        operation.setSucceededCount(success);
        operation.setFailedCount(error);
        operation.setCompletedAt(Instant.now());
        
        if (error == 0) {
            operation.setStatus("COMPLETED");
        } else if (success == 0) {
            operation.setStatus("FAILED");
        } else {
            operation.setStatus("PARTIAL_SUCCESS");
        }
        
        bulkOperationRepository.save(operation);

        auditService.audit("BULK_JOB_COMPLETED", "BULK_OPERATION", operationId.toString(), 
                operation.getStatus(), java.util.Map.of("successCount", success, "errorCount", error));
    }
}
