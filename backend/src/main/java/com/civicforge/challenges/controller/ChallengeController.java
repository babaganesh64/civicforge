package com.civicforge.challenges.controller;

import com.civicforge.challenges.domain.ChallengePriority;
import com.civicforge.challenges.domain.ChallengeStatus;
import com.civicforge.challenges.dto.ChallengeDetailResponse;
import com.civicforge.challenges.dto.ChallengeFilterParams;
import com.civicforge.challenges.dto.ChallengeListItem;
import com.civicforge.challenges.dto.ReviewActionRequest;
import com.civicforge.challenges.dto.SubmitChallengeRequest;
import com.civicforge.challenges.service.ChallengeService;
import com.civicforge.common.dto.ApiResponse;
import com.civicforge.common.dto.PageResponse;
import com.civicforge.identity.security.CivicForgeUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/challenges")
@Slf4j
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;

    private CivicForgeUserDetails principal() {
        return (CivicForgeUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public PageResponse<ChallengeListItem> listChallenges(
        @RequestParam(required = false) ChallengeStatus status,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) ChallengePriority priority,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        CivicForgeUserDetails user = principal();
        ChallengeFilterParams filters = new ChallengeFilterParams(status, category, priority, search, null);
        Pageable pageable = PageRequest.of(page, size);
        Page<ChallengeListItem> result = challengeService.listChallenges(filters, pageable, user.getUserId(), user.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
        return PageResponse.of(result);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<ChallengeDetailResponse> submitChallenge(@Valid @RequestBody SubmitChallengeRequest req) {
        CivicForgeUserDetails user = principal();
        ChallengeDetailResponse res = challengeService.submitChallenge(req, user.getUserId());
        return ApiResponse.success(res, "Challenge submitted successfully");
    }

    @GetMapping("/{id}")
    @org.springframework.cache.annotation.Cacheable(value = "challenges", key = "#id")
    public ApiResponse<ChallengeDetailResponse> getChallenge(@PathVariable UUID id) {
        CivicForgeUserDetails user = principal();
        ChallengeDetailResponse res = challengeService.getChallenge(id, user.getUserId(), user.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
        return ApiResponse.success(res);
    }

    @PostMapping("/{id}/evidence")
    public ApiResponse<ChallengeDetailResponse> attachEvidence(
        @PathVariable UUID id,
        @RequestPart MultipartFile file,
        @RequestPart(required = false) String description
    ) {
        CivicForgeUserDetails user = principal();
        ChallengeDetailResponse res = challengeService.attachEvidence(id, file, description, user.getUserId());
        return ApiResponse.success(res, "Evidence attached successfully");
    }

    @PostMapping("/{id}/actions")
    public ApiResponse<ChallengeDetailResponse> performAction(@PathVariable UUID id, @Valid @RequestBody ReviewActionRequest req) {
        CivicForgeUserDetails user = principal();
        ChallengeDetailResponse res = challengeService.performAction(id, req, user.getUserId(), user.getUsername(), user.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
        return ApiResponse.success(res, "Action performed successfully");
    }

    @GetMapping("/{id}/history")
    public ApiResponse<List<ChallengeDetailResponse.HistoryItem>> getChallengeHistory(@PathVariable UUID id) {
        CivicForgeUserDetails user = principal();
        ChallengeDetailResponse res = challengeService.getChallenge(id, user.getUserId(), user.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
        return ApiResponse.success(res.history());
    }
}
