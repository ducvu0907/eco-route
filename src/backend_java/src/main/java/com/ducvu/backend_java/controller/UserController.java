package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.NotificationResponse;
import com.ducvu.backend_java.dto.response.SubscriptionResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.model.Role;
import com.ducvu.backend_java.service.NotificationService;
import com.ducvu.backend_java.service.SubscriptionService;
import com.ducvu.backend_java.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {
  private final UserService userService;

  @GetMapping("/users")
  public ApiResponse<List<UserResponse>> getUsers() {
    log.info("Received get users request");
    var result = userService.getUsers();
    return ApiResponse.<List<UserResponse>>builder()
        .message("Get users successfully")
        .result(result)
        .build();
  }

  @GetMapping("/users/{userId}")
  public ApiResponse<UserResponse> getUserById(@PathVariable("userId") String userId) {
    log.info("Received get user request");
    var result = userService.getUserById(userId);
    return ApiResponse.<UserResponse>builder()
        .message("Get user successfully")
        .result(result)
        .build();
  }


}
