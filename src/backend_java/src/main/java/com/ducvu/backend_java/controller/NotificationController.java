package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.NotificationResponse;
import com.ducvu.backend_java.service.NotificationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {
  private final NotificationService notificationService;

  @GetMapping("/users/{userId}/notifications")
  public ApiResponse<List<NotificationResponse>> getNotificationsByUserId(@PathVariable("userId") String userId) {
    log.info("Received get notifications by user id request");
    var result = notificationService.getNotificationsByUser(userId);
    return ApiResponse.<List<NotificationResponse>>builder()
        .message("Get notifications by user id successfully")
        .result(result)
        .build();
  }

  @PostMapping("/notifications/{notificationId}/read")
  public ApiResponse<NotificationResponse> readNotification(@PathVariable("notificationId") String notificationId) {
    log.info("Received read notification request");
    var result = notificationService.readNotification(notificationId);
    return ApiResponse.<NotificationResponse>builder()
        .message("Read notification successfully")
        .result(result)
        .build();
  }

}
