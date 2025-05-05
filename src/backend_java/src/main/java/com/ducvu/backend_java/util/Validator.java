package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.request.AuthRequest;
import com.ducvu.backend_java.dto.request.UserCreateRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class Validator {
  public void validate(UserCreateRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  public void validate(AuthRequest request) {
    if (!isValid(request)) {
      throw new RuntimeException("Invalid request format");
    }
  }

  private boolean isValid(UserCreateRequest request) {
    return StringUtils.hasText(request.getUsername())
        && StringUtils.hasText(request.getPassword())
        && StringUtils.hasText(request.getPhone())
        && request.getRole() != null;
  }

  private boolean isValid(AuthRequest request) {
    return StringUtils.hasText(request.getUsername())
        && StringUtils.hasText(request.getPassword());
  }

}
