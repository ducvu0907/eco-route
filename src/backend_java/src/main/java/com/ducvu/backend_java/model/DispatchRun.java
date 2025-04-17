package com.ducvu.backend_java.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class DispatchRun {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID) 
  private String id;

  private LocalDateTime startTime;

  private LocalDateTime endTime;

  @Enumerated(value = EnumType.STRING)
  private DispatchRunStatus status;
}
