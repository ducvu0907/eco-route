package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.service.UserService;
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
public class UserController {
  private final UserService userService;

  @GetMapping("/drivers/not-assigned")
  public ApiResponse<List<UserResponse>> getDriversNotAssigned() {
    log.info("Received get drivers not assigned request");
    var result = userService.getDriversNotAssigned();
    return ApiResponse.<List<UserResponse>>builder()
        .message("Get drivers not assigned successfully")
        .result(result)
        .build();
  }

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
