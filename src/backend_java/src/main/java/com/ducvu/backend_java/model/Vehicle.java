package com.ducvu.backend_java.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
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

  private Integer capacity;

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
