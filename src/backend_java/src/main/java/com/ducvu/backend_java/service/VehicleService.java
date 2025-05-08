package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.VehicleCreateRequest;
import com.ducvu.backend_java.dto.request.VehicleUpdateRequest;
import com.ducvu.backend_java.dto.response.VehicleResponse;
import com.ducvu.backend_java.model.Depot;
import com.ducvu.backend_java.model.User;
import com.ducvu.backend_java.model.Vehicle;
import com.ducvu.backend_java.model.VehicleStatus;
import com.ducvu.backend_java.repository.DepotRepository;
import com.ducvu.backend_java.repository.UserRepository;
import com.ducvu.backend_java.repository.VehicleRepository;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleService {
  private final VehicleRepository vehicleRepository;
  private final UserRepository userRepository;
  private final DepotRepository depotRepository;
  private final Validator validator;
  private final Mapper mapper;

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
    User driver = userRepository.findById(request.getDriverId())
        .orElseThrow(() -> new RuntimeException("Driver not found"));

    Depot depot = depotRepository.findById(request.getDepotId())
        .orElseThrow(() -> new RuntimeException("Depot not found"));

    Vehicle vehicle = Vehicle.builder()
        .driver(driver)
        .depot(depot)
        .licensePlate(request.getLicensePlate())
        .capacity(request.getCapacity())
        .status(VehicleStatus.IDLE)
        .build();

    return mapper.map(vehicleRepository.save(vehicle));
  }

  public VehicleResponse updateVehicle(String vehicleId, VehicleUpdateRequest request) {
    Vehicle vehicle = vehicleRepository.findById(vehicleId)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    if (request.getDriverId() != null) {
      User driver = userRepository.findById(request.getDriverId())
          .orElseThrow(() -> new RuntimeException("Driver not found"));
      vehicle.setDriver(driver);
    }

    if (request.getDepotId() != null) {
      Depot depot = depotRepository.findById(request.getDepotId())
          .orElseThrow(() -> new RuntimeException("Depot not found"));
      vehicle.setDepot(depot);
    }

    if (request.getLicensePlate() != null) {
      vehicle.setLicensePlate(request.getLicensePlate());
    }

    if (request.getCapacity() != null) {
      vehicle.setCapacity(request.getCapacity());
    }

    return mapper.map(vehicleRepository.save(vehicle));
  }

}

