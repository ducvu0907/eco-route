package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.response.RouteResponse;
import com.ducvu.backend_java.model.*;
import com.ducvu.backend_java.repository.DispatchRepository;
import com.ducvu.backend_java.repository.RouteRepository;
import com.ducvu.backend_java.repository.VehicleRepository;
import com.ducvu.backend_java.util.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {
  private final DispatchRepository dispatchRepository;
  private final RouteRepository routeRepository;
  private final VehicleRepository vehicleRepository;
  private final Mapper mapper;

  public RouteResponse markRouteAsDone(String routeId) {
    Route route = routeRepository.findById(routeId)
        .orElseThrow(() -> new RuntimeException("Route not found"));

    route.setStatus(RouteStatus.COMPLETED);
    return mapper.map(routeRepository.save(route));
  }

  public RouteResponse getVehicleCurrentRoute(String vehicleId) {
    Vehicle vehicle = vehicleRepository.findById(vehicleId)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    if (vehicle.getStatus() != VehicleStatus.ACTIVE) {
      throw new RuntimeException("Vehicle is not active");
    }

    Dispatch dispatch = dispatchRepository.findActiveDispatch()
        .orElseThrow(() -> new RuntimeException("No active dispatch found"));

    Route route = routeRepository.findByDispatchIdAndVehicleId(dispatch.getId(), vehicleId)
        .orElseThrow(() -> new RuntimeException("Route not found"));

    return mapper.map(route);
  }

  public RouteResponse getRouteById(String routeId) {

    Route route = routeRepository.findById(routeId)
        .orElseThrow(() -> new RuntimeException("Route not found"));

    return mapper.map(route);
  }

  public List<RouteResponse> getRoutesByDispatchId(String dispatchId) {
    return routeRepository.findByDispatchId(dispatchId)
        .stream()
        .map(mapper::map)
        .toList();
  }

  public List<RouteResponse> getRoutesByVehicleId(String vehicleId) {
    return routeRepository.findByVehicleId(vehicleId)
        .stream()
        .map(mapper::map)
        .toList();
  }

}
