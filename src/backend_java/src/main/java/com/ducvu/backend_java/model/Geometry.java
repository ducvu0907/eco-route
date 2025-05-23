package com.ducvu.backend_java.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Geometry {
  private String type;
  private List<List<Double>> coordinates;
}
