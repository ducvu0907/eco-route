package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.VehicleCreateRequest;
import com.ducvu.backend_java.dto.request.VehicleUpdateRequest;
import com.ducvu.backend_java.dto.response.VehicleRealtimeData;
import com.ducvu.backend_java.dto.response.VehicleResponse;
import com.ducvu.backend_java.model.*;
import com.ducvu.backend_java.repository.DepotRepository;
import com.ducvu.backend_java.repository.UserRepository;
import com.ducvu.backend_java.repository.VehicleRepository;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import com.google.api.core.ApiFuture;
import com.google.firebase.database.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleService {
  private final VehicleRepository vehicleRepository;
  private final UserRepository userRepository;
  private final DepotRepository depotRepository;
  private final Validator validator;
  private final Mapper mapper;
  private final DatabaseReference db;

  // TODO
  @PostConstruct
  public void listenToVehiclesUpdate() {
    db.addChildEventListener(new ChildEventListener() {

      @Override
      public void onChildAdded(DataSnapshot snapshot, String previousChildName) { }

      @Override
      public void onChildChanged(DataSnapshot snapshot, String previousChildName) {
        log.info("Vehicle updated: {}", snapshot);
        Vehicle vehicle = vehicleRepository.findById(snapshot.getKey())
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        VehicleRealtimeData data = snapshot.getValue(VehicleRealtimeData.class);

        vehicle.setCurrentLatitude(data.getLatitude());
        vehicle.setCurrentLongitude(data.getLatitude());
        vehicle.setCurrentLoad(data.getLoad());

        vehicleRepository.save(vehicle);
        log.info("Sync vehicle real-time data successfully");
      }

      @Override
      public void onChildRemoved(DataSnapshot snapshot) { }

      @Override
      public void onChildMoved(DataSnapshot snapshot, String previousChildName) { }

      @Override
      public void onCancelled(DatabaseError error) { }
    });
  }

  public VehicleResponse getVehicleByDriverId(String driverId) {
    Vehicle vehicle = vehicleRepository.findByDriverId(driverId)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    return mapper.map(vehicle);
  }

  public VehicleResponse getVehicleById(String vehicleId) {
    Vehicle vehicle = vehicleRepository.findById(vehicleId)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    return mapper.map(vehicle);
  }

  public List<VehicleResponse> getVehicles() {
    return vehicleRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  public VehicleResponse createVehicle(VehicleCreateRequest request) {
    validator.validate(request);

    vehicleRepository.findByLicensePlate(request.getLicensePlate())
        .ifPresent(v -> {throw new RuntimeException("Vehicle already exists");});

    Vehicle vehicle = Vehicle.builder()
        .licensePlate(request.getLicensePlate())
        .status(VehicleStatus.IDLE)
        .type(request.getType())
        .capacity(request.getType() == VehicleType.THREE_WHEELER ? 300.0 : 1000.0) // map vehicle type to capacity
        .currentLoad(0.)
        .build();

    // validator already made sure driver id is not null
    if (request.getDriverId() != null) {
      User driver = userRepository.findById(request.getDriverId())
          .orElseThrow(() -> new RuntimeException("Driver not found"));

      vehicleRepository.findByDriverId(request.getDriverId())
          .ifPresent(v -> {
            throw new RuntimeException("Driver is already assigned");
          });

      vehicle.setDriver(driver);
    }

    // validator already made sure depot id is not null
    if (request.getDepotId() != null) {
      Depot depot = depotRepository.findById(request.getDepotId())
          .orElseThrow(() -> new RuntimeException("Depot not found"));

      vehicle.setDepot(depot);
      vehicle.setCategory(depot.getCategory());
      vehicle.setCurrentLatitude(depot.getLatitude());
      vehicle.setCurrentLongitude(depot.getLongitude());
    }

    Vehicle savedVehicle = vehicleRepository.save(vehicle);
    syncVehicleToFirebase(savedVehicle);

    return mapper.map(savedVehicle);

  }

  public VehicleResponse updateVehicle(String vehicleId, VehicleUpdateRequest request) {
    Vehicle vehicle = vehicleRepository.findById(vehicleId)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    if (vehicle.getStatus() == VehicleStatus.ACTIVE) {
      throw new RuntimeException("Vehicle is active, cannot update info");
    }

    if (request.getStatus() != null && !request.getStatus().equals(vehicle.getStatus())) {
      vehicle.setStatus(request.getStatus());
    }

    if (request.getDriverId() != null
        && (vehicle.getDriver() == null || !vehicle.getDriver().getId().equals(request.getDriverId()))
    ) {
      User driver = userRepository.findById(request.getDriverId())
          .orElseThrow(() -> new RuntimeException("Driver not found"));

      vehicleRepository.findByDriverId(request.getDriverId())
          .ifPresent(v -> {
            throw new RuntimeException("Driver is already assigned");
          });

      vehicle.setDriver(driver);
    }

    if (request.getDepotId() != null && !request.getDepotId().equals(vehicle.getDepot().getId())) {
      Depot depot = depotRepository.findById(request.getDepotId())
          .orElseThrow(() -> new RuntimeException("Depot not found"));

      vehicle.setDepot(depot);
      vehicle.setCategory(depot.getCategory());
    }

    return mapper.map(vehicleRepository.save(vehicle));
  }

  public void deleteVehicle(String vehicleId) {
    Vehicle vehicle = vehicleRepository.findById(vehicleId)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    if (vehicle.getStatus() == VehicleStatus.ACTIVE) {
      throw new RuntimeException("Cannot delete active vehicle");
    }

    if (vehicle.getDriver() != null) {
      vehicle.getDriver().setVehicle(null);
    }

    vehicleRepository.deleteById(vehicleId);
  }

  // sync to real-time db after creating
  // because client would subscribe to this to read positions
  private void syncVehicleToFirebase(Vehicle vehicle) {
    DatabaseReference vehicleRef = db.child(vehicle.getId());

    VehicleRealtimeData data = VehicleRealtimeData
        .builder()
        .latitude(vehicle.getCurrentLatitude())
        .longitude(vehicle.getCurrentLongitude())
        .load(vehicle.getCurrentLoad())
        .build();

    vehicleRef.setValueAsync(data);
  }

}

