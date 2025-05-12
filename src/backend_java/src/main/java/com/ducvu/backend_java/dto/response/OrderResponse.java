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
  private Integer index;
  private String userId;
  private String routeId;
  private Double latitude;
  private Double longitude;
  private String address;
  private Double weight;
  private OrderStatus status;
  private LocalDateTime completedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
