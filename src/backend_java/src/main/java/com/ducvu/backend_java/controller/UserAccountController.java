package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.UserAccountResponse;
import com.ducvu.backend_java.service.UserAccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserAccountController {
  private final UserAccountService userAccountService;

  @GetMapping("/me")
  public ApiResponse<UserAccountResponse> getMe() {
    log.info("Received get me request");
    var result = userAccountService.getMe();
    return ApiResponse.<UserAccountResponse>builder()
        .message("Get your profile successfully")
        .result(result)
        .build();
  }

}
