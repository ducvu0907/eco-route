package com.ducvu.backend_java.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dispatch_run")
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

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
