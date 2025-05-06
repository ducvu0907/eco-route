package com.ducvu.backend_java.dto.response;

import com.ducvu.backend_java.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
  private String id;
  private String userId;
  private Double latitude;
  private Double longitude;
  private String address;
  private Double estimatedWeight;
  private OrderStatus status;
  private LocalDateTime completedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
