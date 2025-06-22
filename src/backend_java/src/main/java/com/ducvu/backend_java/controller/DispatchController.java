package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.DispatchResponse;
import com.ducvu.backend_java.dto.response.RouteResponse;
import com.ducvu.backend_java.service.DispatchService;
import com.ducvu.backend_java.service.RouteService;
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
public class DispatchController {
  private final DispatchService dispatchService;

  @GetMapping("/dispatches/current")
  public ApiResponse<DispatchResponse> getCurrentDispatch() {
    log.info("Đã nhận yêu cầu lấy điều phối hiện tại"); // Updated message
    var result = dispatchService.getCurrentDispatch();
    return ApiResponse.<DispatchResponse>builder()
        .message("Lấy điều phối hiện tại thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/dispatches/{dispatchId}")
  public ApiResponse<DispatchResponse> getDispatchById(@PathVariable("dispatchId") String dispatchId) {
    log.info("Đã nhận yêu cầu lấy điều phối theo ID"); // Updated message
    var result = dispatchService.getDispatchById(dispatchId);
    return ApiResponse.<DispatchResponse>builder()
        .message("Lấy điều phối theo ID thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/dispatches")
  public ApiResponse<List<DispatchResponse>> getDispatches() {
    log.info("Đã nhận yêu cầu lấy các điều phối"); // Updated message
    var result = dispatchService.getDispatches();
    return ApiResponse.<List<DispatchResponse>>builder()
        .message("Lấy các điều phối thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/dispatches")
  public ApiResponse<Void> createDispatch() {
    log.info("Đã nhận yêu cầu tạo điều phối"); // Updated message
    dispatchService.createDispatch();
    return ApiResponse.<Void>builder()
        .message("Tạo điều phối thành công") // Updated message
        .build();
  }

}