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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {
  private final DispatchRepository dispatchRepository;
  private final RouteRepository routeRepository;
  private final VehicleRepository vehicleRepository;
  private final Mapper mapper;
  private final NotificationService notificationService;
  private final UserService userService;

  public List<RouteResponse> getRoutes() {
    return routeRepository.findAll().stream()
        .map(mapper::map)
        .toList();
  }

  public RouteResponse markRouteAsCompleted(String routeId) {
    Route route = routeRepository.findById(routeId)
        .orElseThrow(() -> new RuntimeException("Route not found"));

    for (Order order : route.getOrders()) {
      if (order.getStatus() == OrderStatus.PENDING) {
        throw new RuntimeException("There are pending orders");
      }
    }

    route.setStatus(RouteStatus.COMPLETED);
    route.getVehicle().setStatus(VehicleStatus.IDLE);
    route.setCompletedAt(LocalDateTime.now());

    route = routeRepository.save(route);
    notifyCompletedRoute(route);

    // mark dispatch as completed if there are no routes in progress
    Dispatch dispatch = route.getDispatch();
    if (dispatch.getRoutes().stream().allMatch(r -> r.getStatus() == RouteStatus.COMPLETED)) {
      dispatch.setStatus(DispatchStatus.COMPLETED);
      dispatchRepository.save(dispatch);
      notifyCompletedDispatch(dispatch);
    }

    return mapper.map(route);
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

  private void notifyCompletedRoute(Route route) {
    User manager = userService.getManager();
    notificationService.sendSingleNotification("Route is completed", manager, NotificationType.ROUTE, route.getId());
  }

  private void notifyCompletedDispatch(Dispatch dispatch) {
    User manager = userService.getManager();
    notificationService.sendSingleNotification("Dispatch is completed", manager, NotificationType.DISPATCH, dispatch.getId());
  }

}
