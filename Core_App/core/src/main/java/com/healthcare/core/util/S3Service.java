package com.healthcare.core.util;

import com.healthcare.core.config.S3ConfigProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;

@Service
public class S3Service {

    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);

    private final S3Client s3Client;
    private final S3ConfigProperties s3ConfigProperties;
    private final S3Presigner s3Presigner;

    public S3Service(S3Client s3Client, S3ConfigProperties s3ConfigProperties, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3ConfigProperties = s3ConfigProperties;
        this.s3Presigner = s3Presigner;
    }

    public String uploadFile(String keyName, byte[] file) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(s3ConfigProperties.getBucketName())
                    .key(keyName)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file));

            logger.info("File uploaded successfully: {}", keyName);
            return keyName;
        } catch (S3Exception e) {
            logger.error("Error uploading file to S3: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }

    public String getPresignedUrl(String s3Key) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(s3ConfigProperties.getBucketName())
                    .key(s3Key)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofHours(2)) // URL valid for 1 hour
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);

            return presignedRequest.url().toString();
        } catch (S3Exception e) {
            logger.error("Error generating pre-signed URL: {}", e.getMessage());
            throw new RuntimeException("Failed to generate pre-signed URL", e);
        }
    }

    public byte[] downloadFile(String keyName) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(s3ConfigProperties.getBucketName())
                    .key(keyName)
                    .build();

            ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);

            return s3Object.readAllBytes();
        } catch (S3Exception | IOException e) {
            logger.error("Error downloading file from S3: {}", e.getMessage());
            throw new RuntimeException("Failed to download file from S3", e);
        }
    }

    public boolean fileExists(String keyName) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(s3ConfigProperties.getBucketName())
                    .key(keyName)
                    .build();

            s3Client.headObject(headObjectRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (S3Exception e) {
            logger.error("Error checking file existence in S3: {}", e.getMessage());
            throw new RuntimeException("Failed to check file existence in S3", e);
        }
    }

}