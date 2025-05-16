package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.response.NotificationResponse;
import com.ducvu.backend_java.model.Notification;
import com.ducvu.backend_java.repository.NotificationRepository;
import com.ducvu.backend_java.util.Mapper;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
  private final NotificationRepository notificationRepository;
  private final Mapper mapper;
  private final FirebaseMessaging firebaseMessaging;

  public void sendBatchNotifications(String content, List<String> fcmTokens) {
    if (fcmTokens == null || fcmTokens.isEmpty()) {
      log.warn("No FCM tokens provided for batch notification.");
      return;
    }

    MulticastMessage message = MulticastMessage.builder()
        .putData("title", "Notification")
        .putData("body", content)
        .addAllTokens(fcmTokens)
        .build();

    try {
      BatchResponse response = firebaseMessaging.sendMulticast(message);
      log.info("Batch notification sent. Success: {}, Failure: {}",
          response.getSuccessCount(), response.getFailureCount());

      if (response.getFailureCount() > 0) {
        response.getResponses().stream()
            .filter(r -> !r.isSuccessful())
            .forEach(r -> log.error("Error sending message: {}", r.getException().getMessage()));
      }
    } catch (Exception e) {
      log.error("Failed to send batch notification", e);
    }
  }

  public void sendSingleNotification(String content, String fcmToken) {
    if (fcmToken == null || fcmToken.isEmpty()) {
      log.warn("FCM token is null or empty. Notification not sent.");
      return;
    }

    Message message = Message.builder()
        .setToken(fcmToken)
        .setNotification(
            com.google.firebase.messaging.Notification.builder()
                .setTitle("Notification")
                .setBody(content)
                .build()
        )
        .build();

    try {
      String response = firebaseMessaging.send(message);
      log.info("Notification sent successfully. Response: {}", response);
    } catch (Exception e) {
      log.error("Failed to send notification to token: {}", fcmToken, e);
    }
  }

  public List<NotificationResponse> getNotificationsByUser(String userId) {
    return notificationRepository.findByUserId(userId)
        .stream()
        .map(mapper::map)
        .toList();
  }

  public NotificationResponse readNotification(String notificationId) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new RuntimeException("Notification not found"));
    notification.setIsRead(true);

    return mapper.map(notificationRepository.save(notification));
  }

}
