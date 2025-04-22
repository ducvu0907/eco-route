package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.request.AuthRequest;
import com.ducvu.backend_java.dto.request.UserAccountCreateRequest;
import com.ducvu.backend_java.exception.InvalidRequestException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class Validator {
  public boolean isValid(UserAccountCreateRequest request) {
    return StringUtils.hasText(request.getUsername())
        && StringUtils.hasText(request.getPassword())
        && request.getRole() != null;
  }

  public boolean isValid(AuthRequest request) {
    return StringUtils.hasText(request.getUsername())
        && StringUtils.hasText(request.getPassword());
  }

  public void validate(UserAccountCreateRequest request) {
    if (!isValid(request)) {
      throw new InvalidRequestException("Invalid request");
    }
  }

  public void validate(AuthRequest request) {
    if (!isValid(request)) {
      throw new InvalidRequestException("Invalid request");
    }
  }

}
