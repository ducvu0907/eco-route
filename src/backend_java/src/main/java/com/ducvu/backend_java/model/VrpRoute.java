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
public class VrpRoute {

  @JsonProperty("vehicle_id")
  private String vehicleId;
  private List<VrpJob> steps;
  private Double distance;
  private Double duration;
  private Geometry geometry;
}
