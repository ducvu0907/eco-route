package com.ducvu.backend_java.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VrpJob {
  private String id;
  private VrpLocation location;
  private Double demand;
}
