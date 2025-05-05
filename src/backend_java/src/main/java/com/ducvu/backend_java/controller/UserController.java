package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {
  private final UserService userService;

  @GetMapping("/me")
  public ApiResponse<UserResponse> getMe() {
    log.info("Received get me request");
    var result = userService.getMe();
    return ApiResponse.<UserResponse>builder()
        .message("Get your profile successfully")
        .result(result)
        .build();
  }

}
