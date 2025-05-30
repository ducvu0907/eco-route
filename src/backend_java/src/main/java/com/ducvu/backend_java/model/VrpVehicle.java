package com.ducvu.backend_java.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VrpVehicle {
  private String id;
  @JsonProperty("depot_id")
  private String depotId;
  private List<Double> location; // lat,lon
  private Double capacity;
  private String profile; // driving-car or driving-hgv
}
