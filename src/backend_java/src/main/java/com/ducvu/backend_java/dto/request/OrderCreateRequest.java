package com.ducvu.backend_java.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequest {
  private Double latitude;
  private Double longitude;
  private String address; // if null we reverse geocode using osm api
  private Double weight;
}
