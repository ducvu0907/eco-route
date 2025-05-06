package com.ducvu.backend_java.controller;

import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.request.SubscriptionCreateRequest;
import com.ducvu.backend_java.dto.response.SubscriptionResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.service.SubscriptionService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class SubscriptionController {
  private final SubscriptionService subscriptionService;

  @GetMapping("/users/{userId}")
  @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_MANAGER')")
  public ApiResponse<SubscriptionResponse> getSubscriptionByUser(@PathVariable("userId") String userId) {
    log.info("Received get subscription by user request");
    var result = subscriptionService.getSubscriptionByUser(userId);
    return ApiResponse.<SubscriptionResponse>builder()
        .message("Get subscription by user successfully")
        .result(result)
        .build();
  }

  @GetMapping("")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<List<SubscriptionResponse>> getSubscriptions() {
    log.info("Received get subscriptions request");
    var result = subscriptionService.getSubscriptions();
    return ApiResponse.<List<SubscriptionResponse>>builder()
        .message("Get subscriptions successfully")
        .result(result)
        .build();
  }

  @PostMapping("")
  @PreAuthorize("hasRole('ROLE_CUSTOMER')")
  public ApiResponse<SubscriptionResponse> createSubscription(@RequestBody SubscriptionCreateRequest request) {
    log.info("Received create subscription request");
    var result = subscriptionService.createSubscription(request);
    return ApiResponse.<SubscriptionResponse>builder()
        .message("Create subscription successfully")
        .result(result)
        .build();
  }

}
