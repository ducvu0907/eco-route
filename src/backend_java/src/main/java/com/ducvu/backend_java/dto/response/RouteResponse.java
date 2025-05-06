package com.ducvu.backend_java.dto.response;

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
  private Double totalDistance;
  private List<NodeResponse> nodes;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
