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
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class OrderController {
  private final OrderService orderService;

  @GetMapping("/orders/in-progress")
  public ApiResponse<List<OrderResponse>> getOngoingOrders() {
    log.info("Received get ongoing orders request");
    var result = orderService.getInProgressOrdersSorted();
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Get ongoing orders successfully")
        .result(result)
        .build();
  }

  @GetMapping("/orders/pending")
  public ApiResponse<List<OrderResponse>> getPendingOrders() {
    log.info("Received get pending orders request");
    var result = orderService.getPendingOrdersSorted();
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Get pending orders successfully")
        .result(result)
        .build();
  }

  @GetMapping("/orders")
  public ApiResponse<List<OrderResponse>> getOrders() {
    log.info("Received get orders request");
    var result = orderService.getOrdersSorted();
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Get orders successfully")
        .result(result)
        .build();
  }

  @GetMapping("/users/{userId}/orders")
  public ApiResponse<List<OrderResponse>> getOrdersByUserId(@PathVariable("userId") String userId) {
    log.info("Received get orders by user id request");
    var result = orderService.getOrdersByUserId(userId);
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Get orders by user id successfully")
        .result(result)
        .build();
  }

  @GetMapping("/orders/{orderId}")
  public ApiResponse<OrderResponse> getOrderById(@PathVariable("orderId") String orderId) {
    log.info("Received get order by id request");
    var result = orderService.getOrderById(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Get order by id successfully")
        .result(result)
        .build();
  }

  @PostMapping(value = "/orders", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<OrderResponse> createOrder(
      @RequestPart("request") OrderCreateRequest request, @RequestPart("file") MultipartFile file) {
    log.info("Received order create request: {}", request);
    var result = orderService.createOrder(request, file);
    return ApiResponse.<OrderResponse>builder()
        .message("Create order successfully")
        .result(result)
        .build();
  }

  @PostMapping("/orders/{orderId}/cancel")
  public ApiResponse<OrderResponse> markOrderAsCancelled(@PathVariable("orderId") String orderId) {
    log.info("Received mark order as cancelled");
    var result = orderService.markOrderAsCancelled(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Mark order as cancelled successfully")
        .result(result)
        .build();
  }

  @PostMapping("/orders/{orderId}/done")
  public ApiResponse<OrderResponse> markOrderAsDone(@PathVariable("orderId") String orderId) {
    log.info("Received mark order as done");
    var result = orderService.markOrderAsDone(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Mark order as done successfully")
        .result(result)
        .build();
  }

  @PostMapping("/orders/{orderId}")
  public ApiResponse<OrderResponse> updateOrder(@PathVariable("orderId") String orderId, @RequestBody OrderUpdateRequest request) {
    log.info("Received order update request: {}", request);
    var result = orderService.updateOrder(orderId, request);
    return ApiResponse.<OrderResponse>builder()
        .message("Update order successfully")
        .result(result)
        .build();
  }

}
