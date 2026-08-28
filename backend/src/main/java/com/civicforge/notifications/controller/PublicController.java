package com.civicforge.notifications.controller;

import com.civicforge.challenges.repository.ChallengeRepository;
import com.civicforge.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final ChallengeRepository challengeRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getPublicStats() {
        long totalChallenges = challengeRepository.count();
        return ResponseEntity.ok(ApiResponse.success(Map.of("totalChallenges", totalChallenges)));
    }
}
