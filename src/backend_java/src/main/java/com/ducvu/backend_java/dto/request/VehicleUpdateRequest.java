package com.ducvu.backend_java.dto.request;


import com.ducvu.backend_java.model.VehicleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUpdateRequest {
  private String driverId;
  private String depotId;
  private VehicleStatus status;
}
