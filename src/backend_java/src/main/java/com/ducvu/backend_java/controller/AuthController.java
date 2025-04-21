package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.request.AuthRequest;
import com.ducvu.backend_java.dto.request.UserAccountCreateRequest;
import com.ducvu.backend_java.dto.response.AuthResponse;
import com.ducvu.backend_java.dto.response.UserAccountResponse;
import com.ducvu.backend_java.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
  private final AuthService authService;

  @PostMapping("/register")
  public ApiResponse<UserAccountResponse> register(@RequestBody UserAccountCreateRequest request) {
    log.info("Received register request: {}", request);
    var result = authService.register(request);
    return ApiResponse.<UserAccountResponse>builder()
        .message("Register successfully")
        .result(result)
        .build();
  }

  @PostMapping("/login")
  public ApiResponse<AuthResponse> login(@RequestBody AuthRequest request) {
    log.info("Received login request: {}", request);
    var result = authService.login(request);
    return ApiResponse.<AuthResponse>builder()
        .message("Login successfully")
        .result(result)
        .build();
  }

}
