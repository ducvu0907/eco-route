package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.request.OrderCreateRequest;
import com.ducvu.backend_java.dto.request.OrderUpdateRequest;
import com.ducvu.backend_java.dto.response.OrderResponse;
import com.ducvu.backend_java.repository.OrderRepository;
import com.ducvu.backend_java.service.OrderService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class OrderController {
  private final OrderService orderService;

  @GetMapping("")
  @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_CUSTOMER')")
  public ApiResponse<List<OrderResponse>> getOrders(@RequestParam(value = "userId", required = false) String userId) {
    log.info("Received get orders request");
    var result = orderService.getOrders(userId);
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Get orders successfully")
        .result(result)
        .build();
  }

  @GetMapping("/{orderId}")
  @PreAuthorize("hasAnyRole('ROLE_MANAGER', 'ROLE_CUSTOMER')")
  public ApiResponse<OrderResponse> getOrder(@PathVariable("orderId") String orderId) {
    log.info("Received get order request");
    var result = orderService.getOrder(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Get order successfully")
        .result(result)
        .build();
  }

  // TODO: this should notify manager on new order
  @PostMapping("")
  @PreAuthorize("hasRole('ROLE_CUSTOMER')")
  public ApiResponse<OrderResponse> createOrder(OrderCreateRequest request) {
    log.info("Received order create request: {}", request);
    var result = orderService.createOrder(request);
    return ApiResponse.<OrderResponse>builder()
        .message("Create order successfully")
        .result(result)
        .build();
  }

  // currently used for driver to update order status
  @PostMapping("/{orderId}")
  public ApiResponse<OrderResponse> updateOrder(@PathVariable("orderId") String orderId, @RequestBody OrderUpdateRequest request) {
    log.info("Received order update request: {}", request);
    var result = orderService.updateOrder(orderId, request);
    return ApiResponse.<OrderResponse>builder()
        .message("Update order successfully")
        .result(result)
        .build();
  }

}
