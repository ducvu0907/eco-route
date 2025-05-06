package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.response.*;
import com.ducvu.backend_java.model.*;
import com.ducvu.backend_java.repository.VehicleRepository;
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
        .createdAt(depot.getCreatedAt())
        .updatedAt(depot.getUpdatedAt())
        .build();
  }

  public VehicleResponse map(Vehicle vehicle) {
    return VehicleResponse.builder()
        .id(vehicle.getId())
        .driverId(vehicle.getDriver().getId())
        .depotId(vehicle.getDepot().getId())
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
        .sequenceNumber(node.getSequenceNumber())
        .routeId(node.getRoute().getId())
        .orderId(node.getOrder().getId())
        .subscriptionId(node.getSubscription().getId())
        .latitude(node.getLatitude())
        .longitude(node.getLongitude())
        .address(node.getAddress())
        .estimatedWeight(node.getEstimatedWeight())
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
        .estimatedWeight(order.getEstimatedWeight())
        .status(order.getStatus())
        .completedAt(order.getCompletedAt())
        .createdAt(order.getCreatedAt())
        .updatedAt(order.getUpdatedAt())
        .build();
  }

  public SubscriptionResponse map(Subscription subscription) {
    return SubscriptionResponse.builder()
        .id(subscription.getId())
        .userId(subscription.getUser().getId())
        .latitude(subscription.getLatitude())
        .longitude(subscription.getLongitude())
        .address(subscription.getAddress())
        .estimatedWeight(subscription.getEstimatedWeight())
        .createdAt(subscription.getCreatedAt())
        .updatedAt(subscription.getUpdatedAt())
        .build();

  }

  public NotificationResponse map(Notification notification) {
    return NotificationResponse.builder()
        .id(notification.getId())
        .type(notification.getType())
        .message(notification.getMessage())
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .updatedAt(notification.getUpdatedAt())
        .build();
  }

}
