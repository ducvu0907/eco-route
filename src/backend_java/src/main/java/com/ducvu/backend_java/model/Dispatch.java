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
@Table(name = "dispatches")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Dispatch {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID) 
  private String id;

  @Builder.Default
  @OneToMany(mappedBy = "dispatch", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Route> routes = new ArrayList<>();

  @Enumerated(value = EnumType.STRING)
  private DispatchStatus status;

  private LocalDateTime completedAt;

  @CreationTimestamp
  private LocalDateTime createdAt;


  @UpdateTimestamp
  private LocalDateTime updatedAt;
}
