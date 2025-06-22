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
      log.warn("Không có người dùng nào được cung cấp"); // Updated message
      return List.of();
    }

    if (refIds.size() != users.size()) {
      throw new RuntimeException("Kích thước danh sách refIds không khớp với kích thước danh sách người dùng"); // Updated message
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
    log.info("Đang gửi thông báo đến {}", users); // Updated message

    List<String> fcmTokens = users.stream()
        .map(User::getFcmToken)
        .filter(Objects::nonNull)
        .toList();

    saveAll(content, users, type, refIds); // still persist notifications

    if (fcmTokens.isEmpty()) {
      log.warn("Không có mã thông báo FCM nào được cung cấp cho thông báo hàng loạt."); // Updated message
      return;
    }

    MulticastMessage message = MulticastMessage.builder()
        .putData("title", "Thông báo") // Updated message
        .putData("body", content)
        .addAllTokens(fcmTokens)
        .build();

    try {
      BatchResponse response = firebaseMessaging.sendEachForMulticast(message);
      log.info("Đã gửi thông báo hàng loạt. Thành công: {}, Thất bại: {}", // Updated message
          response.getSuccessCount(), response.getFailureCount());

      if (response.getFailureCount() > 0) {
        response.getResponses().stream()
            .filter(r -> !r.isSuccessful())
            .forEach(r -> log.error("Lỗi khi gửi tin nhắn: {}", r.getException().getMessage())); // Updated message
      }
    } catch (Exception e) {
      log.error("Không thể gửi thông báo hàng loạt", e); // Updated message
    }
  }

  public void sendSingleNotification(String content, User user, NotificationType type, String refId) {
    log.info("Đang gửi thông báo đến {}", user); // Updated message
    save(content, user, type, refId); // still persist notification

    if (user.getFcmToken() == null) {
      log.warn("Mã thông báo FCM là null hoặc trống. Thông báo không được gửi."); // Updated message
      return;
    }

    Message message = Message.builder()
        .setToken(user.getFcmToken())
        .setNotification(
            com.google.firebase.messaging.Notification.builder()
                .setTitle("Thông báo") // Updated message
                .setBody(content)
                .build()
        )
        .build();

    try {
      String response = firebaseMessaging.send(message);
      log.info("Thông báo đã được gửi thành công. Phản hồi: {}", response); // Updated message
    } catch (Exception e) {
      log.error("Không thể gửi thông báo đến mã thông báo: {}", user, e); // Updated message
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
        .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo")); // Updated message

    notification.setIsRead(true);
    return mapper.map(notificationRepository.save(notification));
  }

}