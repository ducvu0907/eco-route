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
@RequestMapping("/api/notifications")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {
  private final NotificationService notificationService;

  @PostMapping("/{notificationId}")
  public ApiResponse<NotificationResponse> readNotification(@PathVariable("notificationId") String notificationId) {
    log.info("Received read notification request");
    var result = notificationService.readNotification(notificationId);
    return ApiResponse.<NotificationResponse>builder()
        .message("Read notification successfully")
        .result(result)
        .build();
  }

}
