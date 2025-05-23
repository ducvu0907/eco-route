package com.ducvu.backend_java.dto.request;


import com.ducvu.backend_java.model.VrpJob;
import com.ducvu.backend_java.model.VrpRoute;
import com.ducvu.backend_java.model.VrpVehicle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VrpRequest {
  List<VrpVehicle> vehicles;
  List<VrpRoute> routes;
  List<VrpJob> jobs;
  String profile; // driving-car or driving-hgv
}

