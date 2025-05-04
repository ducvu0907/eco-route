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
@Table(name = "vehicle")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Vehicle {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id; 

  @OneToOne
  @JoinColumn(name = "driver_id")
  private UserAccount driver;

  @ManyToOne
  @JoinColumn(name = "depot_id")
  private Depot depot;

  private String licensePlate;

  private Double capacity;

  private Double currentLatitude;

  private Double currentLongitude;

  private Double currentLoad;

  @Enumerated(value = EnumType.STRING)
  private VehicleStatus status;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
