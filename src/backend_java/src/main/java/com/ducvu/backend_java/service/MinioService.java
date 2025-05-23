package com.ducvu.backend_java.service;

import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {
  private final MinioClient minioClient;

  @Value("${minio.endpoint}")
  private String endpoint;

  @Value("${minio.bucket-name}")
  private String bucketName;

  @PostConstruct
  public void initBucket() {
    try {
      boolean exists = minioClient.bucketExists(
          BucketExistsArgs.builder().bucket(bucketName).build());

      if (!exists) {
        log.info("Creating bucket: {}", bucketName);
        minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());

        String policyJson = """
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "PublicReadGetObject",
              "Effect": "Allow",
              "Principal": "*",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::%s/*"
            }
          ]
        }
        """.formatted(bucketName);

        minioClient.setBucketPolicy(
            SetBucketPolicyArgs.builder()
                .bucket(bucketName)
                .config(policyJson)
                .build()
        );

        log.info("Public read access granted to bucket '{}'", bucketName);

      } else {
        log.info("Bucket {} already exists", bucketName);
      }

    } catch (Exception e) {
      throw new RuntimeException("Failed to initialize MinIO bucket", e);
    }
  }


  public String uploadFile(MultipartFile file) {
    try (InputStream is = file.getInputStream()) {
      String objectName = UUID.randomUUID() + "_" + file.getOriginalFilename();

      minioClient.putObject(
          PutObjectArgs.builder()
              .bucket(bucketName)
              .object(objectName)
              .stream(is, file.getSize(), -1)
              .contentType(file.getContentType())
              .build()
      );

      log.info("Uploaded file to MinIO: {}", objectName);
      return String.format("%s/%s/%s", endpoint, bucketName, objectName);

    } catch (Exception e) {
      throw new RuntimeException("Failed to upload file to MinIO", e);
    }
  }

}
