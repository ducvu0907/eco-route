package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
  List<Vehicle> findByDepotId(String depotId);
}
