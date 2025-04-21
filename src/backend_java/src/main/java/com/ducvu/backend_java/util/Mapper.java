package com.ducvu.backend_java.util;

import com.ducvu.backend_java.dto.response.AuthResponse;
import com.ducvu.backend_java.dto.response.UserAccountResponse;
import com.ducvu.backend_java.model.UserAccount;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

  public UserAccountResponse map(UserAccount userAccount) {
    return UserAccountResponse.builder()
        .id(userAccount.getId())
        .username(userAccount.getUsername())
        .phone(userAccount.getPhone())
        .role(userAccount.getRole())
        .build();
  }

}
