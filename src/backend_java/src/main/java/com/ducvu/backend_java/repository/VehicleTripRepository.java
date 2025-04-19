package com.ducvu.backend_java.repository;

import com.ducvu.backend_java.model.VehicleTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleTripRepository extends JpaRepository<VehicleTrip, String> {

}
