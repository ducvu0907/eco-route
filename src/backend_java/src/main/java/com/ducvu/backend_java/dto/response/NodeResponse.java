package com.ducvu.backend_java.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NodeResponse {
  private String id;
  private Integer sequenceNumber;
  private String routeId;
  private String orderId;
  private String subscriptionId;
  private Double latitude;
  private Double longitude;
  private String address;
  private Double estimatedWeight;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
