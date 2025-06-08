package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.OrderCreateRequest;
import com.ducvu.backend_java.dto.request.OrderUpdateRequest;
import com.ducvu.backend_java.dto.response.OrderResponse;
import com.ducvu.backend_java.model.*;
import com.ducvu.backend_java.repository.DispatchRepository;
import com.ducvu.backend_java.repository.OrderRepository;
import com.ducvu.backend_java.repository.RouteRepository;
import com.ducvu.backend_java.repository.UserRepository;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
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
  private final MinioService minioService;

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

  public List<OrderResponse> getInProgressOrdersSorted() {
    return orderRepository.findAllInProgressOrdersSorted()
        .stream()
        .map(mapper::map)
        .toList();
  }

  public List<OrderResponse> getInProgressOrders() {
    return orderRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  public List<OrderResponse> getPendingOrdersSorted() {
    return orderRepository.findAllPendingOrdersSorted()
        .stream()
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

  public List<OrderResponse> getOrdersSorted() {
    return orderRepository.findAllOrdersSorted()
        .stream()
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

  public OrderResponse updateOrder(String orderId, OrderUpdateRequest request, MultipartFile file) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    if (request.getAddress() != null && request.getLatitude() != null && request.getLongitude() != null) {
      order.setAddress(request.getAddress());
      order.setLatitude(request.getLatitude());
      order.setLongitude(request.getLongitude());
    }

    if (request.getWeight() != null) {
      order.setWeight(request.getWeight());
    }

    if (request.getDescription() != null) {
      order.setDescription(request.getDescription());
    }

    if (request.getCategory() != null) {
      order.setCategory(request.getCategory());
    }

    if (file != null) {
      String imageUrl = minioService.uploadFile(file); // save into minio
      order.setImageUrl(imageUrl);
    }

    order = orderRepository.save(order);
    notifyUpdatedOrder(order);
    return mapper.map(order);
  }
  public OrderResponse createOrder(OrderCreateRequest request, MultipartFile file) {
    validator.validate(request);
    User user = userService.getCurrentUser();

    Order order = Order.builder()
        .user(user)
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .address(request.getAddress())
        .category(request.getCategory())
        .description(request.getDescription())
        .weight(request.getWeight())
        .status(OrderStatus.PENDING) // default to pending
        .build();

    if (file != null) {
      String imageUrl = minioService.uploadFile(file); // save into minio
      order.setImageUrl(imageUrl);
    }


    order = orderRepository.save(order);

    notifyNewOrder(order);
    return mapper.map(order);
  }

  public OrderResponse markOrderAsReassignment(String orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    order.setStatus(OrderStatus.REASSIGNED);
    order = orderRepository.save(order);

    notifyOrderReassignment(order);
    return mapper.map(order);
  }

  public OrderResponse markOrderAsCancelled(String orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.REASSIGNED) {
      throw new RuntimeException("Order is not cancellable");
    }

    order.setStatus(OrderStatus.CANCELLED);
    // order.setCompletedAt(LocalDateTime.now());

    order = orderRepository.save(order);

    notifyOrderCancelled(order);
    return mapper.map(order);
  }

  public OrderResponse markOrderAsCompleted(String orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    order.setStatus(OrderStatus.COMPLETED);
    order.setCompletedAt(LocalDateTime.now());

    order = orderRepository.save(order);

    notifyOrderCompleted(order);
    return mapper.map(order);
  }


  private void notifyOrderReassignment(Order order) {
    User customer = order.getUser();
    notificationService.sendSingleNotification("Order is reassigned", customer, NotificationType.ORDER, order.getId());
  }

  private void notifyUpdatedOrder(Order order) {
    User manager = userService.getManager();
    notificationService.sendSingleNotification("Order is updated", manager, NotificationType.ORDER, order.getId());
  }

  private void notifyNewOrder(Order order) {
    User manager = userService.getManager();
    notificationService.sendSingleNotification("New order", manager, NotificationType.ORDER, order.getId());
  }

  private void notifyOrderCancelled(Order order) {
    User manager = userService.getManager();
    notificationService.sendSingleNotification("Order is cancelled", manager, NotificationType.ORDER, order.getId());
  }

  private void notifyOrderCompleted(Order order) {
    User customer = order.getUser();
    notificationService.sendSingleNotification("Order is completed", customer, NotificationType.ORDER, order.getId());
  }

}
