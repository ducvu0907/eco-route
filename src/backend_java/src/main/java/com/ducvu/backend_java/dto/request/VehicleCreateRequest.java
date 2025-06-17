package com.ducvu.backend_java.dto.request;


import com.ducvu.backend_java.model.TrashCategory;
import com.ducvu.backend_java.model.VehicleType;
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
  private VehicleType type;
}
