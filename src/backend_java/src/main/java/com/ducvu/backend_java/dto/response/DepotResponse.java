package com.ducvu.backend_java.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepotResponse {
  private String id;
  private Double latitude;
  private Double longitude;
  private String address;
  private List<VehicleResponse> vehicles;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
