package com.ducvu.backend_java.dto.response;


import com.ducvu.backend_java.model.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
  private String id;
  private String driverId;
  private String depotId;
  private String licensePlate;
  private Double capacity;
  private Double currentLatitude;
  private Double currentLongitude;
  private Double currentLoad;
  private VehicleStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
