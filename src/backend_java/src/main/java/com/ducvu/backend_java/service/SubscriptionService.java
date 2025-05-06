package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.SubscriptionCreateRequest;
import com.ducvu.backend_java.dto.response.OsmResponse;
import com.ducvu.backend_java.dto.response.SubscriptionResponse;
import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.model.Role;
import com.ducvu.backend_java.model.Subscription;
import com.ducvu.backend_java.model.User;
import com.ducvu.backend_java.repository.SubscriptionRepository;
import com.ducvu.backend_java.util.Helper;
import com.ducvu.backend_java.util.Mapper;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {
  private final SubscriptionRepository subscriptionRepository;
  private final UserService userService;
  private final Validator validator;
  private final Mapper mapper;
  private final Helper helper;

  public SubscriptionResponse getSubscriptionByUser(String userId) {
    User user = userService.getCurrentUser();
    if (!user.getId().equals(userId) && user.getRole() != Role.MANAGER) {
      throw new RuntimeException("Unauthorized");
    }

    Subscription subscription = subscriptionRepository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("Subscription not found"));

    return mapper.map(subscription);
  }

  public List<SubscriptionResponse> getSubscriptions() {
    return subscriptionRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  public SubscriptionResponse createSubscription(SubscriptionCreateRequest request) {
    validator.validate(request);
    User user = userService.getCurrentUser();

    Subscription subscription = Subscription.builder()
        .user(user)
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .address(request.getAddress())
        .estimatedWeight(request.getEstimatedWeight())
        .build();

    if (subscription.getAddress() == null) {
      OsmResponse osmResponse = helper.reverseGeocode(request.getLatitude(), request.getLongitude());
      if (osmResponse.getError() != null) {
        subscription.setAddress(osmResponse.getDisplayName());
        log.info("Get OSM response successfully: {}", osmResponse);
      }
    }

    return mapper.map(subscriptionRepository.save(subscription));
  }

}
