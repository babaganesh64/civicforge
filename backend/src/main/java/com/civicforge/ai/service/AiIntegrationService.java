package com.civicforge.ai.service;

import com.civicforge.ai.dto.AiAnalysisRequest;
import com.civicforge.ai.dto.AiAnalysisResponse;
import com.civicforge.challenges.entity.Challenge;
import com.civicforge.challenges.entity.ChallengeAiAnalysis;
import com.civicforge.challenges.repository.ChallengeAiAnalysisRepository;
import com.civicforge.challenges.repository.ChallengeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiIntegrationService {

    private final ChallengeAiAnalysisRepository challengeAiAnalysisRepository;
    private final ChallengeRepository challengeRepository;
    private final ObjectMapper objectMapper;
    private final RestClient.Builder restClientBuilder;

    @Value("${app.ai.service-url}")
    private String aiServiceUrl;

    @Async
    public void triggerAiAnalysis(UUID challengeId) {
        log.info("Triggering AI analysis for challenge: {}", challengeId);

        ChallengeAiAnalysis analysis = ChallengeAiAnalysis.builder()
                .challengeId(challengeId)
                .status("PENDING")
                .triggeredAt(Instant.now())
                .build();
        analysis = challengeAiAnalysisRepository.save(analysis);

        try {
            Challenge challenge = challengeRepository.findById(challengeId)
                    .orElseThrow(() -> new IllegalArgumentException("Challenge not found: " + challengeId));

            AiAnalysisRequest request = new AiAnalysisRequest(
                    challenge.getId(),
                    challenge.getTitle(),
                    challenge.getDescription()
            );

            RestClient restClient = restClientBuilder.baseUrl(aiServiceUrl).build();

            AiAnalysisResponse response = restClient.post()
                    .uri("/api/v1/analyze")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(AiAnalysisResponse.class);

            if (response != null) {
                analysis.setSuggestedCategory(response.suggestedCategory());
                analysis.setSuggestedPriority(response.suggestedPriority());
                analysis.setSummary(response.summary());
                analysis.setTags(objectMapper.writeValueAsString(response.tags()));
                analysis.setSimilarityCandidates(objectMapper.writeValueAsString(response.similarityCandidates()));
                analysis.setSuggestedOrganizations(objectMapper.writeValueAsString(response.suggestedOrganizations()));
                analysis.setExplanation(response.explanation());
                analysis.setConfidenceScore(response.confidenceScore());
                analysis.setModelId(response.modelId());
                analysis.setModelVersion(response.modelVersion());
                analysis.setStatus("COMPLETED");
                analysis.setCompletedAt(Instant.now());
            } else {
                throw new IllegalStateException("AI service returned null response");
            }

        } catch (Exception e) {
            log.error("Failed to execute AI analysis for challenge {}", challengeId, e);
            analysis.setStatus("FAILED");
            analysis.setErrorMessage(e.getMessage());
            analysis.setCompletedAt(Instant.now());
        } finally {
            challengeAiAnalysisRepository.save(analysis);
        }
    }
}
