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
    log.info("Received get depot request");
    var result = depotService.getDepot(depotId);
    return ApiResponse.<DepotResponse>builder()
        .message("Get depot successfully")
        .result(result)
        .build();
  }

  @GetMapping("/depots")
  public ApiResponse<List<DepotResponse>> getDepots() {
    log.info("Received get depots request");
    var result = depotService.getDepots();
    return ApiResponse.<List<DepotResponse>>builder()
        .message("Get depots successfully")
        .result(result)
        .build();
  }

  @PostMapping("/depots")
  public ApiResponse<DepotResponse> createDepot(@RequestBody DepotCreateRequest request) {
    log.info("Received create depot request: {}", request);
    var result = depotService.createDepot(request);
    return ApiResponse.<DepotResponse>builder()
        .message("Create depot successfully")
        .result(result)
        .build();
  }

  @PostMapping("/depots/{depotId}")
  public ApiResponse<DepotResponse> updateDepot(@PathVariable("depotId") String depotId, @RequestBody DepotUpdateRequest request) {
    log.info("Received update depot request");
    var result = depotService.updateDepot(depotId, request);
    return ApiResponse.<DepotResponse>builder()
        .message("Update depot successfully")
        .result(result)
        .build();
  }

  @DeleteMapping("/depots/{depotId}")
  public ApiResponse<Void> deleteDepot(@PathVariable("depotId") String depotId) {
    log.info("Received delete depot request");
    depotService.deleteDepot(depotId);
    return ApiResponse.<Void>builder()
        .message("Delete depot successfully")
        .build();
  }

}
