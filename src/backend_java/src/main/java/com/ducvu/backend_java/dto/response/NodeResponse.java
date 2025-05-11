package com.ducvu.backend_java.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NodeResponse {
  private String id;
  private Integer index;
  private String routeId;
  private OrderResponse order;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
