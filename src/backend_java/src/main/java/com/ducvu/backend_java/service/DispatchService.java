package com.ducvu.backend_java.service;


import com.ducvu.backend_java.dto.request.VrpRequest;
import com.ducvu.backend_java.dto.response.DispatchResponse;
import com.ducvu.backend_java.dto.response.VrpResponse;
import com.ducvu.backend_java.model.*;
import com.ducvu.backend_java.repository.*;
import com.ducvu.backend_java.util.Mapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DispatchService {
  private final DispatchRepository dispatchRepository;
  private final OrderRepository orderRepository;
  private final VehicleRepository vehicleRepository;
  private final DepotRepository depotRepository;
  private final RouteRepository routeRepository;
  private final NodeRepository nodeRepository;
  private final Mapper mapper;
  private final RestTemplate restTemplate;

  @Value("${vrp.api-url}")
  private String vrpApiUrl;

  public List<DispatchResponse> getDispatches() {
    return dispatchRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  // TODO
  public void createDispatch() {
    // there should be only one or zero
    // if there's ongoing one we use dynamic vrp
    List<Dispatch> runningDispatches = dispatchRepository.findAll()
        .stream()
        .filter(d -> d.getStatus() == DispatchStatus.IN_PROGRESS)
        .toList();

    // pending orders are jobs
    List<Order> orders = orderRepository.findAll()
        .stream()
        .filter(o -> o.getStatus() == OrderStatus.PENDING)
        .toList();

    // depots
    List<Depot> depots = depotRepository.findAll();

    // request preparation
    List<VrpVehicle> vehicles = depots.stream()
        .flatMap(depot -> depot.getVehicles().stream())
        .map(mapper::mapVrp)
        .toList();

    List<VrpJob> jobs = orders.stream()
        .map(mapper::mapVrp)
        .toList();

    List<VrpRoute> routes = new ArrayList<>();

    if (!runningDispatches.isEmpty()) {
      Dispatch ongoingDispatch = runningDispatches.get(0);
      routes = ongoingDispatch.getRoutes()
          .stream()
          .map(mapper::mapVrp)
          .toList();
    }

    VrpRequest vrpRequest = VrpRequest.builder()
        .vehicles(vehicles)
        .routes(routes)
        .jobs(jobs)
        .build();

    log.info("Vrp request: {}", vrpRequest);

    VrpResponse vrpResponse = restTemplate.postForObject(vrpApiUrl, vrpRequest, VrpResponse.class);

    log.info("Vrp response: {}", vrpResponse);

  }


}
