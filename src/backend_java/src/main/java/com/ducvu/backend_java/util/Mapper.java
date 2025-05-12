package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.response.*;
import com.ducvu.backend_java.model.*;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

  public UserResponse map(User user) {
    return UserResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .phone(user.getPhone())
        .role(user.getRole())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .build();
  }

  public DepotResponse map(Depot depot) {
    return DepotResponse.builder()
        .id(depot.getId())
        .latitude(depot.getLatitude())
        .longitude(depot.getLongitude())
        .address(depot.getAddress())
        .vehicles(depot.getVehicles()
            .stream()
            .map(this::map)
            .toList()
        )
        .createdAt(depot.getCreatedAt())
        .updatedAt(depot.getUpdatedAt())
        .build();
  }

  public VehicleResponse map(Vehicle vehicle) {
    return VehicleResponse.builder()
        .id(vehicle.getId())
        .driverId(vehicle.getDriver() == null ? null : vehicle.getDriver().getId())
        .depotId(vehicle.getDepot() == null ? null : vehicle.getDepot().getId())
        .licensePlate(vehicle.getLicensePlate())
        .capacity(vehicle.getCapacity())
        .currentLatitude(vehicle.getCurrentLatitude())
        .currentLongitude(vehicle.getCurrentLongitude())
        .currentLoad(vehicle.getCurrentLoad())
        .status(vehicle.getStatus())
        .createdAt(vehicle.getCreatedAt())
        .updatedAt(vehicle.getUpdatedAt())
        .build();
  }

  public DispatchResponse map(Dispatch dispatch) {
    return DispatchResponse.builder()
        .id(dispatch.getId())
        .status(dispatch.getStatus())
        .completedAt(dispatch.getCompletedAt())
        .createdAt(dispatch.getCreatedAt())
        .updatedAt(dispatch.getUpdatedAt())
        .build();
  }

  public RouteResponse map(Route route) {
    return RouteResponse.builder()
        .id(route.getId())
        .vehicleId(route.getVehicle().getId())
        .dispatchId(route.getDispatch().getId())
        .distance(route.getDistance())
        .orders(route.getOrders()
            .stream()
            .map(this::map)
            .toList()
        )
        .completedAt(route.getCompletedAt())
        .createdAt(route.getCreatedAt())
        .updatedAt(route.getUpdatedAt())
        .build();
  }

  public OrderResponse map(Order order) {
    return OrderResponse.builder()
        .id(order.getId())
        .index(order.getIndex())
        .userId(order.getUser().getId())
        .routeId(order.getRoute() != null ? order.getRoute().getId() : null)
        .latitude(order.getLatitude())
        .longitude(order.getLongitude())
        .address(order.getAddress())
        .weight(order.getWeight())
        .status(order.getStatus())
        .completedAt(order.getCompletedAt())
        .createdAt(order.getCreatedAt())
        .updatedAt(order.getUpdatedAt())
        .build();
  }

  public NotificationResponse map(Notification notification) {
    return NotificationResponse.builder()
        .id(notification.getId())
        .message(notification.getMessage())
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .updatedAt(notification.getUpdatedAt())
        .build();
  }

  public VrpVehicle mapVrp(Vehicle vehicle) {
    return VrpVehicle.builder()
        .id(vehicle.getId())
        .start(new VrpLocation(vehicle.getCurrentLatitude(), vehicle.getCurrentLongitude())) // this should be the same as depot if not running
        .end(new VrpLocation(vehicle.getCurrentLatitude(), vehicle.getCurrentLongitude()))
        .load(vehicle.getCurrentLoad())
        .capacity(vehicle.getCapacity())
        .build();
  }

  public VrpRoute mapVrp(Route route) {
    return VrpRoute.builder()
        .vehicleId(route.getVehicle().getId())
        .steps(
            route.getOrders()
                .stream()
                .map(this::mapVrp)
                .toList()
        )
        .distance(route.getDistance())
        .build();
  }

  public VrpJob mapVrp(Order order) {
    return VrpJob.builder()
        .id(order.getId())
        .location(new VrpLocation(order.getLatitude(), order.getLongitude()))
        .demand(order.getWeight())
        .build();
  }



}
