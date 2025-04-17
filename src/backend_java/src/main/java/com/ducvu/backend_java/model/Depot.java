package com.ducvu.backend_java.model;

import jakarta.persistence.Entity;
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
public class Depot {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID) 
  private String id;

  private String name;

  private Double latitude;

  private Double longitude;

  private String address;
}
