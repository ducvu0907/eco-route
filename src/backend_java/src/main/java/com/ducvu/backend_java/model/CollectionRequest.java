package com.ducvu.backend_java.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollectionRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id; 

  @ManyToOne
  @JoinColumn(name = "user_id")
  private UserAccount user;

  private Double latitude;

  private Double longitude;

  private String address;

  private Double estimatedWeight;

  @Enumerated(value = EnumType.STRING)
  private CollectionRequestStatus status;

  private LocalDateTime completedAt;

  @CreationTimestamp
  private LocalDateTime createdAt;
}
