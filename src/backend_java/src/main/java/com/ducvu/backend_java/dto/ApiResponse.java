package com.ducvu.backend_java.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
  @Builder.Default
  private String code = "00";

  private String message;

  @Builder.Default
  private T result = null;
}
