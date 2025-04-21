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
@Table(name = "trip_stop")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class TripStop {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id; 

  private Integer sequenceNumber;

  @ManyToOne
  @JoinColumn(name = "trip_id")
  private VehicleTrip vehicleTrip;

  @OneToOne
  @JoinColumn(name = "request_id")
  private CollectionRequest collectionRequest;

  private Double latitude;

  private Double longitude;

  private String address;

  private Double estimatedWeight;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
