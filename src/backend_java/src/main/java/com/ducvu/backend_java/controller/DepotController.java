package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.request.DepotCreateRequest;
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
@RequestMapping("/api/depots")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class DepotController {
  private final DepotService depotService;


  @GetMapping("/{depotId}")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<DepotResponse> getDepot(@PathVariable("depotId") String depotId) {
    log.info("Received get depot request");
    var result = depotService.getDepot(depotId);
    return ApiResponse.<DepotResponse>builder()
        .message("Get depot successfully")
        .result(result)
        .build();
  }

  @GetMapping("")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<List<DepotResponse>> getDepots() {
    log.info("Received get depots request");
    var result = depotService.getDepots();
    return ApiResponse.<List<DepotResponse>>builder()
        .message("Get depots successfully")
        .result(result)
        .build();
  }

  @PostMapping("")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<DepotResponse> createDepot(@RequestBody DepotCreateRequest request) {
    log.info("Received create depot request");
    var result = depotService.createDepot(request);
    return ApiResponse.<DepotResponse>builder()
        .message("Create depot successfully")
        .result(result)
        .build();
  }

  @DeleteMapping("/{depotId}")
  @PreAuthorize("hasRole('ROLE_MANAGER')")
  public ApiResponse<DepotResponse> deleteDepot(@PathVariable("depotId") String depotId) {
    log.info("Received delete depot request");
    depotService.deleteDepot(depotId);
    return ApiResponse.<DepotResponse>builder()
        .message("Delete depot successfully")
        .build();
  }

}
