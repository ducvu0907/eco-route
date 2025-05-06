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
@Table(name = "nodes")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Node {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id; 

  private Integer sequenceNumber;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "route_id")
  private Route route;

  @OneToOne
  @JoinColumn(name = "order_id")
  private Order order;

  @ManyToOne
  @JoinColumn(name = "subscription_id")
  private Subscription subscription;

  private Double latitude;

  private Double longitude;

  private String address;

  private Double estimatedWeight;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
