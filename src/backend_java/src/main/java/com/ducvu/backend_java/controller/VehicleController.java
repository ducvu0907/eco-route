package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.request.VehicleCreateRequest;
import com.ducvu.backend_java.dto.request.VehicleUpdateRequest;
import com.ducvu.backend_java.dto.response.RouteResponse;
import com.ducvu.backend_java.dto.response.VehicleResponse;
import com.ducvu.backend_java.repository.VehicleRepository;
import com.ducvu.backend_java.service.RouteService;
import com.ducvu.backend_java.service.VehicleService;
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
public class VehicleController {
  private final VehicleService vehicleService;

  @GetMapping("/users/{driverId}/vehicle")
  public ApiResponse<VehicleResponse> getVehicleByDriverId(@PathVariable("driverId") String driverId) {
    log.info("Đã nhận yêu cầu lấy phương tiện theo ID tài xế"); // Updated message
    var result = vehicleService.getVehicleByDriverId(driverId);
    return ApiResponse.<VehicleResponse>builder()
        .message("Lấy phương tiện theo ID tài xế thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/vehicles/{vehicleId}")
  public ApiResponse<VehicleResponse> getVehicleById(@PathVariable("vehicleId") String vehicleId) {
    log.info("Đã nhận yêu cầu lấy phương tiện theo ID"); // Updated message
    var result = vehicleService.getVehicleById(vehicleId);
    return ApiResponse.<VehicleResponse>builder()
        .message("Lấy phương tiện theo ID thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/vehicles")
  public ApiResponse<List<VehicleResponse>> getVehicles() {
    log.info("Đã nhận yêu cầu lấy danh sách phương tiện"); // Updated message
    var result = vehicleService.getVehicles();
    return ApiResponse.<List<VehicleResponse>>builder()
        .message("Lấy danh sách phương tiện thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/vehicles")
  public ApiResponse<VehicleResponse> createVehicle(@RequestBody VehicleCreateRequest request) {
    log.info("Đã nhận yêu cầu tạo phương tiện: {}", request); // Updated message
    var result = vehicleService.createVehicle(request);
    return ApiResponse.<VehicleResponse>builder()
        .message("Tạo phương tiện thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/vehicles/{vehicleId}")
  public ApiResponse<VehicleResponse> updateVehicle(@PathVariable("vehicleId") String vehicleId, @RequestBody VehicleUpdateRequest request) {
    log.info("Đã nhận yêu cầu cập nhật phương tiện: {}", request); // Updated message
    var result = vehicleService.updateVehicle(vehicleId, request);
    return ApiResponse.<VehicleResponse>builder()
        .message("Cập nhật phương tiện thành công") // Updated message
        .result(result)
        .build();
  }


  @DeleteMapping("/vehicles/{vehicleId}")
  public ApiResponse<Void> deleteVehicle(@PathVariable("vehicleId") String vehicleId) {
    log.info("Đã nhận yêu cầu xóa phương tiện"); // Updated message
    vehicleService.deleteVehicle(vehicleId);
    return ApiResponse.<Void>builder()
        .message("Xóa phương tiện thành công") // Updated message
        .build();
  }
}