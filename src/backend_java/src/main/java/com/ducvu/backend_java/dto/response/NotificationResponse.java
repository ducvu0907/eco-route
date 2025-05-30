package com.ducvu.backend_java.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
  private String id;
  private String content;
  private Boolean isRead;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
