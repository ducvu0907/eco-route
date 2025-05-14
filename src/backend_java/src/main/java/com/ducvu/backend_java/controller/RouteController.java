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

  @PostMapping("/routes/{routeId}/done")
  public ApiResponse<RouteResponse> markRouteAsDone(@PathVariable("routeId") String routeId) {
    log.info("Received mark route as done request");
    var result = routeService.markRouteAsDone(routeId);
    return ApiResponse.<RouteResponse>builder()
        .message("Mark route as done successfully")
        .result(result)
        .build();
  }

  @GetMapping("/vehicles/{vehicleId}/route")
  public ApiResponse<RouteResponse> getVehicleCurrentRoute(@PathVariable("vehicleId") String vehicleId) {
    log.info("Received get vehicle current route request");
    var result = routeService.getVehicleCurrentRoute(vehicleId);
    return ApiResponse.<RouteResponse>builder()
        .message("Get vehicle current route successfully")
        .result(result)
        .build();
  }

  @GetMapping("/routes/{routeId}")
  public ApiResponse<RouteResponse> getRouteById(@PathVariable("routeId") String routeId) {
    log.info("Received get route id request");
    var result = routeService.getRouteById(routeId);
    return ApiResponse.<RouteResponse>builder()
        .message("Get route id successfully")
        .result(result)
        .build();
  }

  @GetMapping("/vehicles/{vehicleId}/routes")
  public ApiResponse<List<RouteResponse>> getRoutesByVehicleId(@PathVariable("vehicleId") String vehicleId) {
    log.info("Received get routes by vehicle id request");
    var result = routeService.getRoutesByVehicleId(vehicleId);
    return ApiResponse.<List<RouteResponse>>builder()
        .message("Get routes by vehicle id successfully")
        .result(result)
        .build();
  }

  @GetMapping("/dispatches/{dispatchId}/routes")
  public ApiResponse<List<RouteResponse>> getRoutesByDispatchId(@PathVariable("dispatchId") String dispatchId) {
    log.info("Received get routes by dispatch request");
    var result = routeService.getRoutesByDispatchId(dispatchId);
    return ApiResponse.<List<RouteResponse>>builder()
        .message("Get routes by dispatch successfully")
        .result(result)
        .build();
  }

}
