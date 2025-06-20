package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.response.NotificationResponse;
import com.ducvu.backend_java.model.Notification;
import com.ducvu.backend_java.model.NotificationType;
import com.ducvu.backend_java.model.User;
import com.ducvu.backend_java.repository.NotificationRepository;
import com.ducvu.backend_java.util.Mapper;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
  private final NotificationRepository notificationRepository;
  private final Mapper mapper;
  private final FirebaseMessaging firebaseMessaging;

  public List<NotificationResponse> saveAll(String content, List<User> users, NotificationType type, List<String> refIds) {
    if (users.isEmpty()) {
      log.warn("No users provided");
      return List.of();
    }

    if (refIds.size() != users.size()) {
      throw new RuntimeException("Mismatch between refIds and users size");
    }

    List<Notification> notifications = IntStream.range(0, users.size())
        .mapToObj(i -> Notification.builder()
            .content(content)
            .type(type)
            .user(users.get(i))
            .refId(refIds.get(i))
            .isRead(false)
            .build()
        )
        .toList();

    List<Notification> savedNotifications = notificationRepository.saveAll(notifications);
    return savedNotifications.stream()
        .map(mapper::map)
        .toList();
  }

  public NotificationResponse save(String content, User user, NotificationType type, String refId) {
    Notification notification = Notification.builder()
        .content(content)
        .type(type)
        .refId(refId)
        .user(user)
        .isRead(false)
        .build();

    return mapper.map(notificationRepository.save(notification));
  }

  public void sendBatchNotifications(String content, List<User> users, NotificationType type, List<String> refIds) {
    log.info("Sending notifications to {}", users);

    List<String> fcmTokens = users.stream()
        .map(User::getFcmToken)
        .filter(Objects::nonNull)
        .toList();

    saveAll(content, users, type, refIds); // still persist notifications

    if (fcmTokens.isEmpty()) {
      log.warn("No FCM tokens provided for batch notification.");
      return;
    }

    MulticastMessage message = MulticastMessage.builder()
        .putData("title", "Notification")
        .putData("body", content)
        .addAllTokens(fcmTokens)
        .build();

    try {
      BatchResponse response = firebaseMessaging.sendEachForMulticast(message);
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

  public void sendSingleNotification(String content, User user, NotificationType type, String refId) {
    log.info("Sending notification to {}", user);
    save(content, user, type, refId); // still persist notification

    if (user.getFcmToken() == null) {
      log.warn("FCM token is null or empty. Notification not sent.");
      return;
    }

    Message message = Message.builder()
        .setToken(user.getFcmToken())
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
      log.error("Failed to send notification to token: {}", user, e);
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
