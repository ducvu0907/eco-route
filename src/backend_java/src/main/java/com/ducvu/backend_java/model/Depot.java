package com.ducvu.backend_java.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "depots")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Depot {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID) 
  private String id;

  @OneToMany(mappedBy = "depot", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Vehicle> vehicles;

  private Double latitude;

  private Double longitude;

  private String address;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

}
