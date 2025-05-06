package com.ducvu.backend_java.controller;


import com.ducvu.backend_java.dto.ApiResponse;
import com.ducvu.backend_java.dto.response.RouteResponse;
import com.ducvu.backend_java.service.RouteService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@Slf4j
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class RouteController {
  private final RouteService routeService;
}
