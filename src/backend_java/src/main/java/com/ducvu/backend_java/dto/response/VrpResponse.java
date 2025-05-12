package com.ducvu.backend_java.dto.response;


import com.ducvu.backend_java.model.VrpRoute;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VrpResponse {
  List<VrpRoute> routes;
  String error;
}
