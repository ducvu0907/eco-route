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
@Table(name = "dispatches")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Dispatch {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID) 
  private String id;

  private LocalDateTime startTime;

  private LocalDateTime endTime;

  @Enumerated(value = EnumType.STRING)
  private DispatchStatus status;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
