package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.model.Role;
import com.ducvu.backend_java.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {
  private final UserService userService;

  @GetMapping("")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<List<UserResponse>> getUsers(@RequestParam(value = "role", required = false) Role role) {
    log.info("Received get users request");
    var result = userService.getUsers(role);
    return ApiResponse.<List<UserResponse>>builder()
        .message("Get users successfully")
        .result(result)
        .build();
  }

  @GetMapping("/{userId}")
  @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_CUSTOMER')")
  public ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
    log.info("Received get user request");
    var result = userService.getUser(userId);
    return ApiResponse.<UserResponse>builder()
        .message("Get user successfully")
        .result(result)
        .build();
  }

}
