package com.ducvu.backend_java.dto.response;


import com.ducvu.backend_java.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountResponse {
  private String id;
  private String username;
  private String phone;
  private Role role;
}
