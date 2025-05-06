package com.ducvu.backend_java.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleCreateRequest {
  private String driverId;
  private String depotId;
  private String licensePlate;
  private Double capacity;
}
