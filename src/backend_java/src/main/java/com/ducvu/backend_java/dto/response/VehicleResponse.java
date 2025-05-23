package com.ducvu.backend_java.dto.response;


import com.ducvu.backend_java.model.Depot;
import com.ducvu.backend_java.model.TrashCategory;
import com.ducvu.backend_java.model.VehicleStatus;
import com.ducvu.backend_java.model.VehicleType;
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
  private UserResponse driver;
  private String depotId;
  private String licensePlate;
  private Double capacity;
  private Double currentLatitude;
  private Double currentLongitude;
  private Double currentLoad;
  private VehicleType type;
  private TrashCategory category;
  private VehicleStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
