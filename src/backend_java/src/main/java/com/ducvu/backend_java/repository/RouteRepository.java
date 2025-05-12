package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
  List<Route> findByVehicleId(String vehicleId);
  List<Route> findByDispatchId(String dispatchId);
  Optional<Route> findByDispatchIdAndVehicleId(String dispatchId, String vehicleId);
}
