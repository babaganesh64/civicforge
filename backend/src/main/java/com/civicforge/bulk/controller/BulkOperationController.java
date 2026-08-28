package com.civicforge.bulk.controller;

import com.civicforge.bulk.dto.BulkJobRequest;
import com.civicforge.bulk.dto.BulkJobResponse;
import com.civicforge.bulk.entity.BulkOperation;
import com.civicforge.bulk.repository.BulkOperationRepository;
import com.civicforge.bulk.service.BulkOperationService;
import com.civicforge.common.exception.CivicForgeException;
import com.civicforge.common.exception.ErrorCode;
import com.civicforge.identity.security.CivicForgeUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bulk")
@RequiredArgsConstructor
public class BulkOperationController {

    private final BulkOperationService bulkOperationService;
    private final BulkOperationRepository bulkOperationRepository;

    @PostMapping("/jobs")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public BulkJobResponse submitBulkJob(@RequestBody @Valid BulkJobRequest request,
                                         @AuthenticationPrincipal CivicForgeUserDetails principal) {
        return bulkOperationService.submitBulkJob(request, principal.getUserId(), principal.getEmail(), principal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
    }

    @GetMapping("/jobs/{id}")
    public BulkJobResponse getBulkJob(@PathVariable UUID id,
                                      @AuthenticationPrincipal CivicForgeUserDetails principal) {
        BulkOperation operation = bulkOperationRepository.findById(id)
                .orElseThrow(() -> new CivicForgeException(ErrorCode.BULK_JOB_NOT_FOUND, "Job not found", HttpStatus.NOT_FOUND));
        
        return new BulkJobResponse(
                operation.getId(),
                operation.getAction(),
                operation.getStatus(),
                operation.getRequestedCount(),
                operation.getSucceededCount(),
                operation.getFailedCount(),
                operation.getCreatedAt(),
                operation.getCompletedAt()
        );
    }
}
