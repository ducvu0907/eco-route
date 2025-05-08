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
@RequestMapping("/api")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class SubscriptionController {
  private final SubscriptionService subscriptionService;

  @GetMapping("/subscriptions/{subscriptionId}")
  public ApiResponse<SubscriptionResponse> getSubscriptionById(@PathVariable("subscriptionId") String subscriptionId) {
    log.info("Received get subscription by id request");
    var result = subscriptionService.getSubscriptionById(subscriptionId);
    return ApiResponse.<SubscriptionResponse>builder()
        .message("Get subscription by id successfully")
        .result(result)
        .build();
  }

  @GetMapping("/subscriptions")
  public ApiResponse<List<SubscriptionResponse>> getSubscriptions() {
    log.info("Received get subscriptions request");
    var result = subscriptionService.getSubscriptions();
    return ApiResponse.<List<SubscriptionResponse>>builder()
        .message("Get subscriptions successfully")
        .result(result)
        .build();
  }

  @GetMapping("/users/{userId}/subscription")
  public ApiResponse<SubscriptionResponse> getSubscriptionByUserId(@PathVariable("userId") String userId) {
    log.info("Received get subscription by user id request");
    var result = subscriptionService.getSubscriptionByUserId(userId);
    return ApiResponse.<SubscriptionResponse>builder()
        .message("Get subscription by user id successfully")
        .result(result)
        .build();
  }

  @PostMapping("/subscriptions")
  public ApiResponse<SubscriptionResponse> createSubscription(@RequestBody SubscriptionCreateRequest request) {
    log.info("Received create subscription request");
    var result = subscriptionService.createSubscription(request);
    return ApiResponse.<SubscriptionResponse>builder()
        .message("Create subscription successfully")
        .result(result)
        .build();
  }

  @DeleteMapping("/subscriptions/{subscriptionId}")
  @PreAuthorize("hasRole('ROLE_CUSTOMER')")
  public ApiResponse<Void> deleteSubscription(@PathVariable("subscriptionId") String subscriptionId) {
    log.info("Received delete subscription request");
    subscriptionService.deleteSubscription(subscriptionId);
    return ApiResponse.<Void>builder()
        .message("Delete subscription successfully")
        .build();
  }

}
