package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.request.DepotCreateRequest;
import com.ducvu.backend_java.dto.request.DepotUpdateRequest;
import com.ducvu.backend_java.dto.response.DepotResponse;
import com.ducvu.backend_java.dto.response.VehicleResponse;
import com.ducvu.backend_java.service.DepotService;
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
public class DepotController {
  private final DepotService depotService;


  @GetMapping("/depots/{depotId}")
  public ApiResponse<DepotResponse> getDepotById(@PathVariable("depotId") String depotId) {
    log.info("Đã nhận yêu cầu lấy kho theo ID"); // Updated message
    var result = depotService.getDepotById(depotId);
    return ApiResponse.<DepotResponse>builder()
        .message("Lấy thông tin kho theo ID thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/depots")
  public ApiResponse<List<DepotResponse>> getDepots() {
    log.info("Đã nhận yêu cầu lấy danh sách kho"); // Updated message
    var result = depotService.getDepots();
    return ApiResponse.<List<DepotResponse>>builder()
        .message("Lấy danh sách kho thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/depots")
  public ApiResponse<DepotResponse> createDepot(@RequestBody DepotCreateRequest request) {
    log.info("Đã nhận yêu cầu tạo kho mới: {}", request); // Updated message
    var result = depotService.createDepot(request);
    return ApiResponse.<DepotResponse>builder()
        .message("Tạo kho thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/depots/{depotId}")
  public ApiResponse<DepotResponse> updateDepot(@PathVariable("depotId") String depotId, @RequestBody DepotUpdateRequest request) {
    log.info("Đã nhận yêu cầu cập nhật kho"); // Updated message
    var result = depotService.updateDepot(depotId, request);
    return ApiResponse.<DepotResponse>builder()
        .message("Cập nhật kho thành công") // Updated message
        .result(result)
        .build();
  }

  @DeleteMapping("/depots/{depotId}")
  public ApiResponse<Void> deleteDepot(@PathVariable("depotId") String depotId) {
    log.info("Đã nhận yêu cầu xóa kho"); // Updated message
    depotService.deleteDepot(depotId);
    return ApiResponse.<Void>builder()
        .message("Xóa kho thành công") // Updated message
        .build();
  }

}