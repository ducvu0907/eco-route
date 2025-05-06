package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.response.RouteResponse;
import com.ducvu.backend_java.repository.RouteRepository;
import com.ducvu.backend_java.util.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {
  private final RouteRepository routeRepository;
  private final Mapper mapper;

  public List<RouteResponse> getRoutesByDispatch(String dispatchId) {
    return routeRepository.findByDispatchId(dispatchId)
        .stream()
        .map(mapper::map)
        .toList();
  }

  public List<RouteResponse> getRoutesByVehicle(String vehicleId) {
    return routeRepository.findByVehicleId(vehicleId)
        .stream()
        .map(mapper::map)
        .toList();
  }

}
