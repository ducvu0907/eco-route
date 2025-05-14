package com.ducvu.backend_java.service;

import com.ducvu.backend_java.dto.request.VrpRequest;
import com.ducvu.backend_java.dto.response.DispatchResponse;
import com.ducvu.backend_java.dto.response.VrpResponse;
import com.ducvu.backend_java.model.*;
import com.ducvu.backend_java.repository.*;
import com.ducvu.backend_java.util.Mapper;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import jakarta.transaction.Transactional;
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
  private final Mapper mapper;
  private final RestTemplate restTemplate;

  @Value("${vrp.api-url}")
  private String vrpApiUrl;


  public DispatchResponse getDispatchById(String dispatchId) {
    Dispatch dispatch = dispatchRepository.findById(dispatchId)
        .orElseThrow(() -> new RuntimeException("Dispatch not found"));
    return mapper.map(dispatch);
  }

  public DispatchResponse getCurrentDispatch() {
    Dispatch dispatch = dispatchRepository.findActiveDispatch()
        .orElseThrow(() -> new RuntimeException("No current dispatch found"));
    return mapper.map(dispatch);
  }

  public List<DispatchResponse> getDispatches() {
    return dispatchRepository.findAll()
        .stream()
        .map(mapper::map)
        .toList();
  }

  @Transactional
  public void createDispatch() {
    Dispatch runningDispatch = dispatchRepository.findActiveDispatch()
        .orElse(null);

    List<Order> orders = orderRepository.findAll()
        .stream()
        .filter(o -> o.getStatus() == OrderStatus.PENDING)
        .toList();

    List<Depot> depots = depotRepository.findAll();

    List<VrpVehicle> vehicles = depots.stream()
        .flatMap(depot -> depot.getVehicles().stream().filter(v -> v.getStatus() != VehicleStatus.REPAIR))
        .map(mapper::mapVrp)
        .toList();

    List<VrpJob> jobs = orders.stream()
        .map(mapper::mapVrp)
        .toList();

    List<VrpRoute> existingRoutes = new ArrayList<>();
    boolean isDynamic = runningDispatch != null;

    if (isDynamic) {
      existingRoutes = runningDispatch.getRoutes()
          .stream()
          .map(mapper::mapVrp)
          .toList();
    }

    VrpRequest vrpRequest = VrpRequest.builder()
        .vehicles(vehicles)
        .routes(existingRoutes)
        .jobs(jobs)
        .build();

    log.info("Request number of vehicles: {}", vrpRequest.getVehicles().toArray().length);
    log.info("Request number of routes: {}", vrpRequest.getRoutes().toArray().length);
    log.info("Request number of jobs: {}", vrpRequest.getJobs().toArray().length);

    VrpResponse vrpResponse = restTemplate.postForObject(vrpApiUrl, vrpRequest, VrpResponse.class);

    if (vrpResponse == null || vrpResponse.getError() != null) {
      throw new RuntimeException("Vrp api error");
    }

    if (vrpResponse.getRoutes().isEmpty()) {
      throw new RuntimeException("No routes updated");
    }

    log.info("Response number of routes: {}", vrpResponse.getRoutes().toArray().length);

    if (isDynamic) {
      updateOngoingDispatch(runningDispatch, vrpResponse);
    } else {
      createNewDispatch(vrpResponse);
    }
  }

  private void updateOngoingDispatch(Dispatch dispatch, VrpResponse vrpResponse) {
    List<Route> updatedRoutes = vrpResponse.getRoutes()
        .stream()
        .map(vrpRoute -> {
          Vehicle vehicle = vehicleRepository.findById(vrpRoute.getVehicleId())
              .orElseThrow(() -> new RuntimeException("Vehicle not found: " + vrpRoute.getVehicleId()));

          vehicle.setStatus(VehicleStatus.ACTIVE);

          Route route = routeRepository.findByDispatchIdAndVehicleId(dispatch.getId(), vehicle.getId())
              .orElseThrow(() -> new RuntimeException("Route not found for dispatch: " + dispatch.getId()));

          route.setOrders(buildOrders(vrpRoute, route));
          route.setDistance(vrpRoute.getDistance());

          return route;
        })
        .toList();

    routeRepository.saveAll(updatedRoutes);
  }

  private void createNewDispatch(VrpResponse vrpResponse) {
    Dispatch dispatch = Dispatch.builder()
        .status(DispatchStatus.IN_PROGRESS)
        .build();

    List<Route> newRoutes = vrpResponse.getRoutes()
        .stream()
        .map(vrpRoute -> buildRouteFromVrp(vrpRoute, dispatch))
        .toList();

    dispatch.setRoutes(newRoutes);
    dispatchRepository.save(dispatch);
  }

  private Route buildRouteFromVrp(VrpRoute vrpRoute, Dispatch dispatch) {
    Vehicle vehicle = vehicleRepository.findById(vrpRoute.getVehicleId())
        .orElseThrow(() -> new RuntimeException("Vehicle not found: " + vrpRoute.getVehicleId()));

    vehicle.setStatus(VehicleStatus.ACTIVE);

    Route route = Route.builder()
        .vehicle(vehicle)
        .dispatch(dispatch)
        .depotId(vehicle.getDepot().getId())
        .distance(vrpRoute.getDistance())
        .status(RouteStatus.IN_PROGRESS)
        .build();

    route.setOrders(buildOrders(vrpRoute, route));
    return route;
  }

  private List<Order> buildOrders(VrpRoute vrpRoute, Route route) {
    List<Order> orders = new ArrayList<>();
    int index = 0;

    for (VrpJob job : vrpRoute.getSteps()) {
      Order order = orderRepository.findById(job.getId())
          .orElseThrow(() -> new RuntimeException("Order not found: " + job.getId()));

      order.setStatus(OrderStatus.IN_PROGRESS);
      order.setIndex(index++);
      order.setRoute(route);

      orders.add(order);
    }

    return orders;
  }
}
