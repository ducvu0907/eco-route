package com.ducvu.backend_java.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
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
  private User driver;

  @ManyToOne
  @JoinColumn(name = "depot_id")
  private Depot depot;

  @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Route> routes = new ArrayList<>();

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

  @Enumerated(value = EnumType.STRING)
  private VehicleType type;

  @Enumerated(value = EnumType.STRING)
  private TrashCategory category;
}
