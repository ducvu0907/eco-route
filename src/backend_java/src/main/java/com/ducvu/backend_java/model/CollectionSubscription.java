package com.ducvu.backend_java.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "collection_subscription")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollectionSubscription {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @OneToOne
  @JoinColumn(name = "user_id")
  private UserAccount user;

  private Double latitude;

  private Double longitude;

  private String address;

  private Double estimatedWeight;

  @Enumerated(value = EnumType.STRING)
  private SubscriptionStatus status;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
