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
        .capacity(request.getCapacity())
        .status(VehicleStatus.IDLE)
        .currentLoad(0.)
        .build();

    if (request.getDriverId() != null) {
      User driver = userRepository.findById(request.getDriverId())
          .orElseThrow(() -> new RuntimeException("Driver not found"));

      vehicleRepository.findByDriverId(request.getDriverId())
          .ifPresent(v -> {
            throw new RuntimeException("Driver is already assigned");
          });

      vehicle.setDriver(driver);
    }

    if (request.getDepotId() != null) {
      Depot depot = depotRepository.findById(request.getDepotId())
          .orElseThrow(() -> new RuntimeException("Depot not found"));
      vehicle.setDepot(depot);
      vehicle.setCurrentLatitude(depot.getLatitude());
      vehicle.setCurrentLongitude(depot.getLongitude());
    }

    return mapper.map(vehicleRepository.save(vehicle));
  }

  public VehicleResponse updateVehicle(String vehicleId, VehicleUpdateRequest request) {
    Vehicle vehicle = vehicleRepository.findById(vehicleId)
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    if (request.getStatus() != null) {
      vehicle.setStatus(request.getStatus());
    }

    if (request.getDriverId() != null) {
      User driver = userRepository.findById(request.getDriverId())
          .orElseThrow(() -> new RuntimeException("Driver not found"));

      vehicleRepository.findByDriverId(request.getDriverId())
          .ifPresent(v -> {
            v.setDriver(null);
            vehicleRepository.save(v);
          });

      vehicle.setDriver(driver);
    }

    if (request.getDepotId() != null) {
      Depot depot = depotRepository.findById(request.getDepotId())
          .orElseThrow(() -> new RuntimeException("Depot not found"));

      vehicle.setDepot(depot);
      vehicle.setCurrentLongitude(depot.getLatitude());
      vehicle.setCurrentLongitude(depot.getLongitude());
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
}

