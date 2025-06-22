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
    log.info("Đã nhận yêu cầu lấy các đơn hàng đang xử lý"); // Updated message
    var result = orderService.getInProgressOrdersSorted();
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Lấy các đơn hàng đang xử lý thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/orders/pending")
  public ApiResponse<List<OrderResponse>> getPendingOrders() {
    log.info("Đã nhận yêu cầu lấy các đơn hàng đang chờ xử lý"); // Updated message
    var result = orderService.getPendingOrdersSorted();
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Lấy các đơn hàng đang chờ xử lý thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/orders")
  public ApiResponse<List<OrderResponse>> getOrders() {
    log.info("Đã nhận yêu cầu lấy danh sách đơn hàng"); // Updated message
    var result = orderService.getOrdersSorted();
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Lấy danh sách đơn hàng thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/users/{userId}/orders")
  public ApiResponse<List<OrderResponse>> getOrdersByUserId(@PathVariable("userId") String userId) {
    log.info("Đã nhận yêu cầu lấy đơn hàng theo ID người dùng"); // Updated message
    var result = orderService.getOrdersByUserId(userId);
    return ApiResponse.<List<OrderResponse>>builder()
        .message("Lấy đơn hàng theo ID người dùng thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/orders/{orderId}")
  public ApiResponse<OrderResponse> getOrderById(@PathVariable("orderId") String orderId) {
    log.info("Đã nhận yêu cầu lấy đơn hàng theo ID"); // Updated message
    var result = orderService.getOrderById(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Lấy đơn hàng theo ID thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping(value = "/orders/{orderId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<OrderResponse> updateOrder(
      @PathVariable("orderId") String orderId,
      @RequestPart("request") OrderUpdateRequest request,
      @RequestPart(value = "file", required = false) MultipartFile file) {
    log.info("Đã nhận yêu cầu cập nhật đơn hàng: {}", request); // Updated message
    var result = orderService.updateOrder(orderId, request, file);
    return ApiResponse.<OrderResponse>builder()
        .message("Cập nhật đơn hàng thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping(value = "/orders", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ApiResponse<OrderResponse> createOrder(
      @RequestPart("request") OrderCreateRequest request, @RequestPart(value = "file", required = false) MultipartFile file) {
    log.info("Đã nhận yêu cầu tạo đơn hàng: {}", request); // Updated message
    var result = orderService.createOrder(request, file);
    return ApiResponse.<OrderResponse>builder()
        .message("Tạo đơn hàng thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/orders/{orderId}/cancelled")
  public ApiResponse<OrderResponse> markOrderAsCancelled(@PathVariable("orderId") String orderId) {
    log.info("Đã nhận yêu cầu hủy đơn hàng"); // Updated message
    var result = orderService.markOrderAsCancelled(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Hủy đơn hàng thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/orders/{orderId}/reassigned")
  public ApiResponse<OrderResponse> markOrderAsReassignment(@PathVariable("orderId") String orderId) {
    log.info("Đã nhận yêu cầu gán lại đơn hàng: {}", orderId); // Updated message
    var result = orderService.markOrderAsReassignment(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Gán lại đơn hàng thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/orders/{orderId}/completed")
  public ApiResponse<OrderResponse> markOrderAsCompleted(@PathVariable("orderId") String orderId) {
    log.info("Đã nhận yêu cầu đánh dấu đơn hàng đã hoàn thành: {}", orderId); // Updated message
    var result = orderService.markOrderAsCompleted(orderId);
    return ApiResponse.<OrderResponse>builder()
        .message("Đánh dấu đơn hàng đã hoàn thành thành công") // Updated message
        .result(result)
        .build();
  }

}