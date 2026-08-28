package com.civicforge.collaboration.controller;

import com.civicforge.collaboration.dto.CollaborationRequestDto;
import com.civicforge.collaboration.entity.CollaborationRequest;
import com.civicforge.collaboration.service.CollaborationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CollaborationController {

    private final CollaborationService collaborationService;

    @PostMapping("/challenges/{id}/collaboration-requests")
    public ResponseEntity<CollaborationRequest> submitCollaborationRequest(
            @PathVariable UUID id,
            @Valid @RequestBody CollaborationRequestDto dto) {
        return ResponseEntity.ok(collaborationService.submitCollaborationRequest(id, dto));
    }

    @GetMapping("/challenges/{id}/collaboration-requests")
    public ResponseEntity<List<CollaborationRequest>> getRequestsForChallenge(@PathVariable UUID id) {
        return ResponseEntity.ok(collaborationService.getRequestsForChallenge(id));
    }

    @PostMapping("/collaboration-requests/{id}/accept")
    public ResponseEntity<CollaborationRequest> acceptCollaborationRequest(@PathVariable UUID id) {
        return ResponseEntity.ok(collaborationService.acceptCollaborationRequest(id));
    }
}
