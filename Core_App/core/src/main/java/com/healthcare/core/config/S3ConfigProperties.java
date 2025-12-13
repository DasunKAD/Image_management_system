package com.healthcare.core.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "aws.s3")
@Data
public class S3ConfigProperties {

    private String region;
    private String bucketName;
    private String accessKey;
    private String secretKey;
}