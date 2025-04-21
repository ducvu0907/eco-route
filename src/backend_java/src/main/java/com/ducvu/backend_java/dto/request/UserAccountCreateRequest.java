package com.ducvu.backend_java.dto.request;

import com.ducvu.backend_java.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountCreateRequest {
  private String username;
  private String password;
  private String phone;
  private String fcmToken;
  private Role role;
}
