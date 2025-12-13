package com.healthcare.core.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
@EnableConfigurationProperties(com.healthcare.core.config.S3ConfigProperties.class)
public class S3Config {

    private final S3ConfigProperties s3ConfigProperties;

    public S3Config(S3ConfigProperties s3ConfigProperties) {
        this.s3ConfigProperties = s3ConfigProperties;
    }

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
                s3ConfigProperties.getAccessKey(),
                s3ConfigProperties.getSecretKey()
        );

        return S3Client.builder()
                .region(Region.of(s3ConfigProperties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }

    @Bean
    public S3Presigner s3Presigner() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
                s3ConfigProperties.getAccessKey(),
                s3ConfigProperties.getSecretKey()
        );

        return S3Presigner.builder()
                .region(Region.of(s3ConfigProperties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}