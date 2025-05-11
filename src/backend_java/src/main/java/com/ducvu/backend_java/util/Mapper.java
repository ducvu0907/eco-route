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
        .driverId(vehicle.getDriver() != null ? vehicle.getDriver().getId() : null)
        .depotId(vehicle.getDepot() != null ? vehicle.getDepot().getId() : null)
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

  public NodeResponse map(Node node) {
    return NodeResponse.builder()
        .id(node.getId())
        .index(node.getIndex())
        .routeId(node.getRoute().getId())
        .order(this.map(node.getOrder()))
        .createdAt(node.getCreatedAt())
        .updatedAt(node.getUpdatedAt())
        .build();
  }

  public DispatchResponse map(Dispatch dispatch) {
    return DispatchResponse.builder()
        .id(dispatch.getId())
        .startTime(dispatch.getStartTime())
        .endTime(dispatch.getEndTime())
        .status(dispatch.getStatus())
        .createdAt(dispatch.getCreatedAt())
        .updatedAt(dispatch.getUpdatedAt())
        .build();
  }

  public RouteResponse map(Route route) {
    return RouteResponse.builder()
        .id(route.getId())
        .vehicleId(route.getVehicle().getId())
        .dispatchId(route.getDispatch().getId())
        .totalDistance(route.getTotalDistance())
        .nodes(route.getNodes()
            .stream()
            .map(this::map)
            .toList()
        )
        .startTime(route.getStartTime())
        .endTime(route.getEndTime())
        .createdAt(route.getCreatedAt())
        .updatedAt(route.getUpdatedAt())
        .build();
  }

  public OrderResponse map(Order order) {
    return OrderResponse.builder()
        .id(order.getId())
        .userId(order.getUser().getId())
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

  public VrpJob mapVrp(Order order) {
    return VrpJob.builder()
        .id(order.getId())
        .location(new VrpLocation(order.getLatitude(), order.getLongitude()))
        .demand(order.getWeight())
        .build();
  }

  public VrpRoute mapVrp(Route route) {
    return VrpRoute.builder()
        .vehicleId(route.getVehicle().getId())
        .steps(
            route.getNodes()
                .stream()
                .map(this::mapVrp)
                .toList()
        )
        .build();
  }

  public VrpJob mapVrp(Node node) {
    return VrpJob.builder()
        .id(node.getOrder().getId())
        .location(new VrpLocation(node.getOrder().getLatitude(), node.getOrder().getLongitude()))
        .demand(node.getOrder().getWeight())
        .build();
  }


}
