package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.request.*;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class Validator {
  public void validate(OrderCreateRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  public void validate(VehicleCreateRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  public void validate(RegisterRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  public void validate(LoginRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  public void validate(DepotUpdateRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  public void validate(DepotCreateRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  private boolean isValid(RegisterRequest request) {
    return StringUtils.hasText(request.getUsername())
        && StringUtils.hasText(request.getPassword())
        && StringUtils.hasText(request.getPhone())
        && request.getRole() != null;
  }

  private boolean isValid(LoginRequest request) {
    return StringUtils.hasText(request.getUsername())
        && StringUtils.hasText(request.getPassword());
  }

  private boolean isValid(DepotUpdateRequest request) {
    return request.getLatitude() != null
        && request.getLongitude() != null
        && request.getAddress() != null;
  }

  private boolean isValid(DepotCreateRequest request) {
    return request.getLatitude() != null
        && request.getLongitude() != null
        && request.getAddress() != null;
  }

  private boolean isValid(VehicleCreateRequest request) {
    return StringUtils.hasText(request.getLicensePlate())
        && request.getCapacity() != null;
  }

  private boolean isValid(OrderCreateRequest request) {
    return request.getLatitude() != null
        && request.getLongitude() != null
        && request.getAddress() != null
        && request.getWeight() != null;
  }
}
