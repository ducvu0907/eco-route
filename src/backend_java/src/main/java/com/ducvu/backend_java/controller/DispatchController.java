package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.RouteResponse;
import com.ducvu.backend_java.service.DispatchService;
import com.ducvu.backend_java.service.RouteService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dispatches")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class DispatchController {
  private final DispatchService dispatchService;
  private final RouteService routeService;

  @GetMapping("/{dispatchId}/routes")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<List<RouteResponse>> getRoutesByDispatch(@PathVariable("dispatchId") String dispatchId) {
    log.info("Received get routes by dispatch request");
    var result = routeService.getRoutesByDispatch(dispatchId);
    return ApiResponse.<List<RouteResponse>>builder()
        .message("Get routes by dispatch successfully")
        .result(result)
        .build();
  }

}
