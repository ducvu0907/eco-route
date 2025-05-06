package com.ducvu.backend_java.dto.response;

import com.ducvu.backend_java.model.NotificationType;
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
  private NotificationType type;
  private String message;
  private Boolean isRead;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
