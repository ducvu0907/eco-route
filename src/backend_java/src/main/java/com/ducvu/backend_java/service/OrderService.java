package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.OrderCreateRequest;
import com.ducvu.backend_java.dto.request.OrderUpdateRequest;
import com.ducvu.backend_java.dto.response.OrderResponse;
import com.ducvu.backend_java.dto.response.OsmResponse;
import com.ducvu.backend_java.model.Order;
import com.ducvu.backend_java.model.OrderStatus;
import com.ducvu.backend_java.model.Role;
import com.ducvu.backend_java.model.User;
import com.ducvu.backend_java.repository.OrderRepository;
import com.ducvu.backend_java.repository.UserRepository;
import com.ducvu.backend_java.util.Helper;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Or;
import org.hibernate.boot.model.relational.ColumnOrderingStrategyStandard;
import org.springframework.stereotype.Service;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
  private final UserService userService;
  private final OrderRepository orderRepository;
  private final Validator validator;
  private final Mapper mapper;
  private final Helper helper;

  public List<OrderResponse> getOrders(String userId) {
    User user = userService.getCurrentUser();

    if (userId != null) {
      if (!user.getId().equals(userId) && user.getRole() != Role.MANAGER) {
        throw new RuntimeException("Unauthorized");
      }

      return orderRepository.findByUserId(userId)
          .stream()
          .map(mapper::map)
          .toList();

    } else {
      if (user.getRole() != Role.MANAGER) {
        throw new RuntimeException("Unauthorized");
      }

      return orderRepository.findAll()
          .stream()
          .map(mapper::map)
          .toList();

    }
  }

  public OrderResponse getOrder(String orderId) {
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
        .estimatedWeight(request.getEstimatedWeight())
        .status(OrderStatus.PENDING) // default to pending
        .build();

    // if address not provided, attempt to reverse the (lat,lon)
    if (order.getAddress() == null) {
      OsmResponse osmResponse = helper.reverseGeocode(request.getLatitude(), request.getLongitude());
      if (osmResponse.getError() != null) {
        order.setAddress(osmResponse.getDisplayName());
        log.info("Get OSM response successfully: {}", osmResponse);
      }
    }

    return mapper.map(orderRepository.save(order));
  }

  // TODO: refactor this
  // currently a placeholder for driver to mark the order as done
  // and this should notify user that the order status has changed
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

}
