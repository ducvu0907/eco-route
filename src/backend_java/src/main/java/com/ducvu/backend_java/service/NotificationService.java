package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.response.NotificationResponse;
import com.ducvu.backend_java.model.Notification;
import com.ducvu.backend_java.repository.NotificationRepository;
import com.ducvu.backend_java.util.Mapper;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
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

  public void sendPushNotification(String content, String fcmToken) {
    log.info("Send push notification to: {}", fcmToken);
    Message message = Message.builder()
        .setToken(fcmToken)
        .setNotification(
            com.google.firebase.messaging.Notification.builder()
                .setTitle("Notification")
                .setBody(content)
                .build()
        )
        .build();

    firebaseMessaging.sendAsync(message);
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
