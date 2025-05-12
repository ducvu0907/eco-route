package com.ducvu.backend_java.dto.response;

import com.ducvu.backend_java.model.RouteStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RouteResponse {
  private String id;
  private String vehicleId;
  private String dispatchId;
  private Double distance;
  private RouteStatus status;
  private List<OrderResponse> orders;
  private LocalDateTime completedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
