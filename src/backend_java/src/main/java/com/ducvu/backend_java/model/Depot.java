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
@Table(name = "depot")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Depot {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID) 
  private String id;

  private Double latitude;

  private Double longitude;

  private String address;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
