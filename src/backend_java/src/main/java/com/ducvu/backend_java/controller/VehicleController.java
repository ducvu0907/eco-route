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
@RequestMapping("/api/vehicles")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class VehicleController {
  private final VehicleService vehicleService;
  private final RouteService routeService;

  @GetMapping("/{vehicleId}/routes")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<List<RouteResponse>> getRoutesByVehicle(@PathVariable("vehicleId") String vehicleId) {
    log.info("Received get routes by vehicle request");
    var result = routeService.getRoutesByVehicle(vehicleId);
    return ApiResponse.<List<RouteResponse>>builder()
        .message("Get routes by vehicle successfully")
        .result(result)
        .build();
  }

  @GetMapping("")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<List<VehicleResponse>> getVehicles() {
    log.info("Received get vehicles request");
    var result = vehicleService.getVehicles();
    return ApiResponse.<List<VehicleResponse>>builder()
        .message("Get vehicles successfully")
        .result(result)
        .build();
  }

  @PostMapping("")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<VehicleResponse> createVehicle(@RequestBody VehicleCreateRequest request) {
    log.info("Received create vehicle request: {}", request);
    var result = vehicleService.createVehicle(request);
    return ApiResponse.<VehicleResponse>builder()
        .message("Create vehicle successfully")
        .result(result)
        .build();
  }

  @PostMapping("/{vehicleId}")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<VehicleResponse> updateVehicle(@PathVariable("vehicleId") String vehicleId, @RequestBody VehicleUpdateRequest request) {
    log.info("Received update vehicle request: {}", request);
    var result = vehicleService.updateVehicle(vehicleId, request);
    return ApiResponse.<VehicleResponse>builder()
        .message("Update vehicle successfully")
        .result(result)
        .build();
  }

}
