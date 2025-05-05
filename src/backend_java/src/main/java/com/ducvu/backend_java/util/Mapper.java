package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.response.UserResponse;
import com.ducvu.backend_java.model.User;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

  public UserResponse map(User user) {
    return UserResponse.builder()
        .id(user.getId())
        .username(user.getUsername())
        .phone(user.getPhone())
        .role(user.getRole())
        .build();
  }

}
