package com.ducvu.backend_java.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRealtimeData {
  private Double latitude;
  private Double longitude;
  private Double load;
}
