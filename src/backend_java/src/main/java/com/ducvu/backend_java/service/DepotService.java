package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.DepotCreateRequest;
import com.ducvu.backend_java.dto.response.DepotResponse;
import com.ducvu.backend_java.dto.response.OsmResponse;
import com.ducvu.backend_java.dto.response.VehicleResponse;
import com.ducvu.backend_java.model.Depot;
import com.ducvu.backend_java.repository.DepotRepository;
import com.ducvu.backend_java.repository.VehicleRepository;
import com.ducvu.backend_java.util.Helper;
import com.ducvu.backend_java.util.Mapper;
import com.ducvu.backend_java.util.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepotService {
  private final DepotRepository depotRepository;
  private final VehicleRepository vehicleRepository;
  private final Validator validator;
  private final Mapper mapper;
  private final Helper helper;

  public DepotResponse getDepot(String depotId) {
    Depot depot = depotRepository.findById(depotId)
        .orElseThrow(() -> new RuntimeException("Depot not found"));
    return mapper.map(depot);
  }

  public List<DepotResponse> getDepots() {
    return depotRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  public DepotResponse createDepot(DepotCreateRequest request) {
    validator.validate(request);

    Depot depot = Depot.builder()
        .latitude(request.getLatitude())
        .longitude(request.getLongitude())
        .address(request.getAddress())
        .build();

//    if (depot.getAddress() == null) {
//      OsmResponse osmResponse = helper.reverseGeocode(request.getLatitude(), request.getLongitude());
//      if (osmResponse != null && osmResponse.getError() != null) {
//        depot.setAddress(osmResponse.getDisplayName());
//        log.info("Get OSM response successfully: {}", osmResponse);
//      }
//    }

    return mapper.map(depotRepository.save(depot));

  }

  public void deleteDepot(String depotId) {
    depotRepository.deleteById(depotId);
  }

}
