package com.civicforge.projects.controller;

import com.civicforge.projects.dto.*;
import com.civicforge.projects.entity.*;
import com.civicforge.projects.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectDto dto) {
        return ResponseEntity.ok(projectService.createProject(dto));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ProjectMember> addProjectMember(
            @PathVariable UUID id,
            @RequestParam UUID userId,
            @RequestParam String role) {
        return ResponseEntity.ok(projectService.addProjectMember(id, userId, role));
    }

    @PostMapping("/{id}/milestones")
    public ResponseEntity<Milestone> createMilestone(
            @PathVariable UUID id,
            @Valid @RequestBody MilestoneDto dto) {
        if (!id.equals(dto.projectId())) {
            throw new IllegalArgumentException("Project ID mismatch");
        }
        return ResponseEntity.ok(projectService.createMilestone(dto));
    }

    @PostMapping("/{id}/deliverables")
    public ResponseEntity<Deliverable> submitDeliverable(
            @PathVariable UUID id,
            @Valid @RequestBody DeliverableDto dto) {
        if (!id.equals(dto.projectId())) {
            throw new IllegalArgumentException("Project ID mismatch");
        }
        return ResponseEntity.ok(projectService.submitDeliverable(dto));
    }

    @PostMapping("/{id}/deliverables/{deliverableId}/approve")
    public ResponseEntity<Deliverable> approveDeliverable(
            @PathVariable UUID id,
            @PathVariable UUID deliverableId) {
        return ResponseEntity.ok(projectService.approveDeliverable(deliverableId));
    }

    @PostMapping("/{id}/metrics")
    public ResponseEntity<ImpactMetric> recordImpactMetric(
            @PathVariable UUID id,
            @Valid @RequestBody ImpactMetricDto dto) {
        if (!id.equals(dto.projectId())) {
            throw new IllegalArgumentException("Project ID mismatch");
        }
        return ResponseEntity.ok(projectService.recordImpactMetric(dto));
    }
}
