package com.ducvu.backend_java.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VrpVehicle {
  private String id;
  private VrpLocation start;
  private VrpLocation end;
  private Double load;
  private Double capacity;
}
