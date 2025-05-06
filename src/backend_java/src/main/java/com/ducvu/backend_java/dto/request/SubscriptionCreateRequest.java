package com.ducvu.backend_java.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCreateRequest {
  private Double latitude;
  private Double longitude;
  private String address;
  private Double estimatedWeight;
}
