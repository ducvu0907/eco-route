package com.ducvu.backend_java.dto.response;

import com.ducvu.backend_java.model.DispatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DispatchResponse {
  private String id;
  private LocalDateTime startTime;
  private LocalDateTime endTime;
  private DispatchStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
