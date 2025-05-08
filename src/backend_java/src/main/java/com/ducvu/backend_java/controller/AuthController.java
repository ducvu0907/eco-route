package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.request.LoginRequest;
import com.ducvu.backend_java.dto.request.RegisterRequest;
import com.ducvu.backend_java.dto.response.AuthResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
  private final AuthService authService;

  @PostMapping("/auth/register")
  public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
    log.info("Received register request: {}", request);
    var result = authService.register(request);
    return ApiResponse.<UserResponse>builder()
        .message("Register successfully")
        .result(result)
        .build();
  }

  @PostMapping("/auth/login")
  public ApiResponse<AuthResponse> login(@RequestBody LoginRequest request) {
    log.info("Received login request: {}", request);
    var result = authService.login(request);
    return ApiResponse.<AuthResponse>builder()
        .message("Login successfully")
        .result(result)
        .build();
  }

}
