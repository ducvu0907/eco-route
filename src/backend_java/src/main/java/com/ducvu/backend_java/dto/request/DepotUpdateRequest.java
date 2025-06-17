package com.ducvu.backend_java.dto.request;


import com.ducvu.backend_java.model.TrashCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepotUpdateRequest {
  private Double latitude;
  private Double longitude;
  private String address;
  private TrashCategory category;
}
