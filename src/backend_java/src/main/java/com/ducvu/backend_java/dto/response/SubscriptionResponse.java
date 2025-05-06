package com.ducvu.backend_java.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
  private String id;
  private String userId;
  private Double latitude;
  private Double longitude;
  private String address;
  private Double estimatedWeight;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
