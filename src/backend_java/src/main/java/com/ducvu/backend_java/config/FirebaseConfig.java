package com.ducvu.backend_java.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.messaging.FirebaseMessaging;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Configuration
public class FirebaseConfig {

  @Value("${firebase.credentials-path}")
  private String firebaseCredentialsPath;

  @Value("${firebase.database-url}")
  private String firebaseDatabaseUrl;

  @PostConstruct
  public void init() {
    try (InputStream serviceAccount = new ClassPathResource(firebaseCredentialsPath).getInputStream()) {
      FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(GoogleCredentials.fromStream(serviceAccount))
          .setDatabaseUrl(firebaseDatabaseUrl)
          .build();

      if (FirebaseApp.getApps().isEmpty()) {
        FirebaseApp.initializeApp(options);
        log.info("FirebaseApp initialized.");
      }

    } catch (IOException e) {
      log.error("Failed to initialize Firebase App", e);
    }
  }

  @Bean
  public FirebaseMessaging firebaseMessaging() {
    return FirebaseMessaging.getInstance(FirebaseApp.getInstance());
  }

  // real-time db for storing vehicles current state (lat/lon/load)
  @Bean
  public DatabaseReference databaseReference() {
    return FirebaseDatabase.getInstance().getReference("/vehicles");
  }

}
