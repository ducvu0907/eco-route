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
    log.info("Received get vehicle by driver id request");
    var result = vehicleService.getVehicleByDriverId(driverId);
    return ApiResponse.<VehicleResponse>builder()
        .message("Get vehicle by driver id successfully")
        .result(result)
        .build();
  }

  @GetMapping("/vehicles/{vehicleId}")
  public ApiResponse<VehicleResponse> getVehicleById(@PathVariable("vehicleId") String vehicleId) {
    log.info("Received get vehicle by id request");
    var result = vehicleService.getVehicleById(vehicleId);
    return ApiResponse.<VehicleResponse>builder()
        .message("Get vehicle by id successfully")
        .result(result)
        .build();
  }

  @GetMapping("/vehicles")
  public ApiResponse<List<VehicleResponse>> getVehicles() {
    log.info("Received get vehicles request");
    var result = vehicleService.getVehicles();
    return ApiResponse.<List<VehicleResponse>>builder()
        .message("Get vehicles successfully")
        .result(result)
        .build();
  }

  @PostMapping("/vehicles")
  public ApiResponse<VehicleResponse> createVehicle(@RequestBody VehicleCreateRequest request) {
    log.info("Received create vehicle request: {}", request);
    var result = vehicleService.createVehicle(request);
    return ApiResponse.<VehicleResponse>builder()
        .message("Create vehicle successfully")
        .result(result)
        .build();
  }

  @PostMapping("/vehicles/{vehicleId}")
  public ApiResponse<VehicleResponse> updateVehicle(@PathVariable("vehicleId") String vehicleId, @RequestBody VehicleUpdateRequest request) {
    log.info("Received update vehicle request: {}", request);
    var result = vehicleService.updateVehicle(vehicleId, request);
    return ApiResponse.<VehicleResponse>builder()
        .message("Update vehicle successfully")
        .result(result)
        .build();
  }

}
