package com.ducvu.backend_java.dto.request;


import com.ducvu.backend_java.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateRequest {
  private OrderStatus status;
}
