package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.response.*;
import com.ducvu.backend_java.model.*;
import org.springframework.stereotype.Component;

import java.util.List;

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
        .driver(this.map(vehicle.getDriver()))
        .depotId(vehicle.getDepot().getId())
        .licensePlate(vehicle.getLicensePlate())
        .capacity(vehicle.getCapacity())
        .currentLatitude(vehicle.getCurrentLatitude())
        .currentLongitude(vehicle.getCurrentLongitude())
        .currentLoad(vehicle.getCurrentLoad())
        .type(vehicle.getType())
        .category(vehicle.getCategory())
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
        .vehicle(this.map(route.getVehicle()))
        .dispatchId(route.getDispatch().getId())
        .distance(route.getDistance())
        .orders(route.getOrders()
            .stream()
            .map(this::map)
            .toList()
        )
        .duration(route.getDuration())
        .coordinates(
            route.getGeometry().getCoordinates()
                .stream()
                .map(List::reversed)
                .toList()
        )
        .status(route.getStatus())
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
        .imageUrl(order.getImageUrl())
        .description(order.getDescription())
        .category(order.getCategory())
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
        .content(notification.getContent())
        .isRead(notification.getIsRead())
        .type(notification.getType())
        .createdAt(notification.getCreatedAt())
        .updatedAt(notification.getUpdatedAt())
        .build();
  }

  public VrpVehicle mapVrp(Vehicle vehicle) {
    return VrpVehicle.builder()
        .id(vehicle.getId())
        .depotId(vehicle.getDepot().getId())
        .location(List.of(vehicle.getCurrentLatitude(), vehicle.getCurrentLongitude()))
        .capacity(vehicle.getCapacity())
        .profile(vehicle.getType() == VehicleType.THREE_WHEELER ? "driving-car" : "driving-hgv")
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
        .duration(route.getDuration())
        .geometry(route.getGeometry())
        .build();
  }

  public VrpDepot mapVrp(Depot depot) {
    return VrpDepot.builder()
        .id(depot.getId())
        .location(List.of(depot.getLatitude(), depot.getLongitude()))
        .build();
  }

  public VrpJob mapVrp(Order order) {
    return VrpJob.builder()
        .id(order.getId())
        .location(List.of(order.getLatitude(), order.getLongitude()))
        .demand(order.getWeight())
        .status(order.getStatus() == OrderStatus.COMPLETED ? "completed" : (order.getStatus() == OrderStatus.IN_PROGRESS ? "in_progress" : "pending"))
        .build();
  }

}
