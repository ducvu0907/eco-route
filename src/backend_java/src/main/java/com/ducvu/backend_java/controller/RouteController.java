package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.RouteResponse;
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
public class RouteController {
  private final RouteService routeService;


  @GetMapping("/routes")
  public ApiResponse<List<RouteResponse>> getRoutes() {
    log.info("Đã nhận yêu cầu lấy danh sách tuyến đường"); // Updated message
    var result = routeService.getRoutes();
    return ApiResponse.<List<RouteResponse>>builder()
        .message("Lấy danh sách tuyến đường thành công") // Updated message
        .result(result)
        .build();
  }

  @PostMapping("/routes/{routeId}/completed")
  public ApiResponse<RouteResponse> markRouteAsCompleted(@PathVariable("routeId") String routeId) {
    log.info("Đã nhận yêu cầu đánh dấu tuyến đường đã hoàn thành"); // Updated message
    var result = routeService.markRouteAsCompleted(routeId);
    return ApiResponse.<RouteResponse>builder()
        .message("Đánh dấu tuyến đường đã hoàn thành thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/vehicles/{vehicleId}/routes/current")
  public ApiResponse<RouteResponse> getVehicleCurrentRoute(@PathVariable("vehicleId") String vehicleId) {
    log.info("Đã nhận yêu cầu lấy tuyến đường hiện tại của phương tiện"); // Updated message
    var result = routeService.getVehicleCurrentRoute(vehicleId);
    return ApiResponse.<RouteResponse>builder()
        .message("Lấy tuyến đường hiện tại của phương tiện thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/routes/{routeId}")
  public ApiResponse<RouteResponse> getRouteById(@PathVariable("routeId") String routeId) {
    log.info("Đã nhận yêu cầu lấy tuyến đường theo ID"); // Updated message
    var result = routeService.getRouteById(routeId);
    return ApiResponse.<RouteResponse>builder()
        .message("Lấy tuyến đường theo ID thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/vehicles/{vehicleId}/routes")
  public ApiResponse<List<RouteResponse>> getRoutesByVehicleId(@PathVariable("vehicleId") String vehicleId) {
    log.info("Đã nhận yêu cầu lấy tuyến đường theo ID phương tiện"); // Updated message
    var result = routeService.getRoutesByVehicleId(vehicleId);
    return ApiResponse.<List<RouteResponse>>builder()
        .message("Lấy tuyến đường theo ID phương tiện thành công") // Updated message
        .result(result)
        .build();
  }

  @GetMapping("/dispatches/{dispatchId}/routes")
  public ApiResponse<List<RouteResponse>> getRoutesByDispatchId(@PathVariable("dispatchId") String dispatchId) {
    log.info("Đã nhận yêu cầu lấy tuyến đường theo ID điều phối"); // Updated message
    var result = routeService.getRoutesByDispatchId(dispatchId);
    return ApiResponse.<List<RouteResponse>>builder()
        .message("Lấy tuyến đường theo ID điều phối thành công") // Updated message
        .result(result)
        .build();
  }

}