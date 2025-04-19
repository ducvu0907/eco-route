package com.ducvu.backend_java.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
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
