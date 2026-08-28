package com.civicforge.files.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
public class S3Config {

    @Bean
    public S3Client s3Client(
        @Value("${app.storage.endpoint:http://localhost:9000}") String endpoint,
        @Value("${app.storage.access-key:minioadmin}") String accessKey,
        @Value("${app.storage.secret-key:minioadmin123}") String secretKey,
        @Value("${app.storage.region:us-east-1}") String region
    ) {
        return S3Client.builder()
            .endpointOverride(URI.create(endpoint))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            .region(Region.of(region))
            .forcePathStyle(true)
            .build();
    }

    @Bean
    public S3Presigner s3Presigner(
        @Value("${app.storage.endpoint:http://localhost:9000}") String endpoint,
        @Value("${app.storage.access-key:minioadmin}") String accessKey,
        @Value("${app.storage.secret-key:minioadmin123}") String secretKey,
        @Value("${app.storage.region:us-east-1}") String region
    ) {
        return S3Presigner.builder()
            .endpointOverride(URI.create(endpoint))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)))
            .region(Region.of(region))
            .build();
    }
}
