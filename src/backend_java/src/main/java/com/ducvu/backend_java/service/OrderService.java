package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.OrderCreateRequest;
import com.ducvu.backend_java.dto.request.OrderUpdateRequest;
import com.ducvu.backend_java.dto.response.OrderResponse;
import com.ducvu.backend_java.model.Order;
import com.ducvu.backend_java.model.OrderStatus;
import com.ducvu.backend_java.model.Role;
import com.ducvu.backend_java.model.User;
import com.ducvu.backend_java.repository.DispatchRepository;
import com.ducvu.backend_java.repository.OrderRepository;
import com.ducvu.backend_java.repository.RouteRepository;
import com.ducvu.backend_java.repository.UserRepository;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
  private final UserService userService;
  private final OrderRepository orderRepository;
  private final RouteRepository routeRepository;
  private final DispatchRepository dispatchRepository;
  private final Validator validator;
  private final Mapper mapper;
  private final NotificationService notificationService;
  private final UserRepository userRepository;

  public List<OrderResponse> getOrdersByUserId(String userId) {
    User user = userService.getCurrentUser();

    if (!user.getId().equals(userId) && user.getRole() != Role.MANAGER) {
      throw new RuntimeException("Unauthorized");
    }

    return orderRepository.findByUserId(userId)
        .stream()
        .map(mapper::map)
        .toList();
  }

  public List<OrderResponse> getOngoingOrders() {
    return orderRepository.findAll()
        .stream()
        .filter(order -> order.getStatus() == OrderStatus.IN_PROGRESS)
        .map(mapper::map)
        .toList();
  }

  public List<OrderResponse> getPendingOrders() {
    return orderRepository.findAll()
        .stream()
        .filter(order -> order.getStatus() == OrderStatus.PENDING)
        .map(mapper::map)
        .toList();
  }

  public List<OrderResponse> getOrders() {
    return orderRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  public OrderResponse getOrderById(String orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));
    User user = userService.getCurrentUser();

    if (!user.getId().equals(order.getUser().getId()) && user.getRole() != Role.MANAGER) {
      throw new RuntimeException("Unauthorized");
    }

    return mapper.map(order);
  }

  public OrderResponse createOrder(OrderCreateRequest request) {
    validator.validate(request);
    User user = userService.getCurrentUser();

    Order order = Order.builder()
        .user(user)
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .address(request.getAddress())
        .weight(request.getWeight())
        .status(OrderStatus.PENDING) // default to pending
        .build();

//    if (order.getAddress() == null) {
//      OsmResponse osmResponse = helper.reverseGeocode(request.getLatitude(), request.getLongitude());
//      if (osmResponse.getError() != null) {
//        order.setAddress(osmResponse.getDisplayName());
//        log.info("Get OSM response successfully: {}", osmResponse);
//      }
//    }

    notifyNewOrder();
    return mapper.map(orderRepository.save(order));
  }

  // driver uses this to update order status
  public OrderResponse markOrderAsDone(String orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    order.setStatus(OrderStatus.COMPLETED);
    notifyOrderCompleted(order);
    return mapper.map(orderRepository.save(order));
  }

  // TODO
  public OrderResponse updateOrder(String orderId, OrderUpdateRequest request) {
    User user = userService.getCurrentUser();
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    if (user.getRole() != Role.DRIVER) {
      throw new RuntimeException("Unauthorized");
    }

    order.setStatus(request.getStatus());
    return mapper.map(orderRepository.save(order));
  }

  private void notifyNewOrder() {
    User manager = userService.getManager();
    notificationService.sendSingleNotification("New order created", manager.getFcmToken());
  }

  private void notifyOrderCompleted(Order order) {
    notificationService.sendSingleNotification("Order is completed", order.getUser().getFcmToken());
  }

}
