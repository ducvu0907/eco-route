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
import java.util.Map;
import java.util.stream.Collectors;

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
  private final NotificationService notificationService;

  @Value("${vrp.api-url}")
  private String vrpApiUrl;


  public DispatchResponse markDispatchAsDone(String dispatchId) {
    Dispatch dispatch = dispatchRepository.findById(dispatchId)
        .orElseThrow(() -> new RuntimeException("Dispatch not found"));

    if (!routeRepository.findByDispatchId(dispatchId).isEmpty()) {
      throw new RuntimeException("Routes are not completed");
    }

    dispatch.setStatus(DispatchStatus.COMPLETED);
    return mapper.map(dispatchRepository.save(dispatch));
  }

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

  public List<String> createSubDispatch(
      List<VrpVehicle> vehicles,
      List<VrpJob> jobs,
      List<VrpRoute> routes,
      boolean isDynamic,
      String profile,
      Dispatch runningDispatch
  ) {
    log.info("Creating sub dispatch");

    if (vehicles.isEmpty() || jobs.isEmpty()) return new ArrayList<>();

    VrpRequest vrpRequest = VrpRequest.builder()
        .vehicles(vehicles)
        .routes(routes)
        .jobs(jobs)
        .profile(profile)
        .build();

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
      createNewDispatch(runningDispatch, vrpResponse);
    }

    log.info("Done creating subdispatch");

    List<String> assignedJobs = vrpResponse.getRoutes().stream()
        .flatMap(route -> route.getSteps().stream())
        .map(VrpJob::getId)
        .toList();

    return assignedJobs;
  }

  private void processCategory(
      List<Order> orders,
      TrashCategory category,
      List<Depot> depots,
      boolean isDynamic,
      Dispatch runningDispatch
  ) {
    log.info("Processing category with vehicle type");

    List<Vehicle> eligibleVehicles = depots.stream()
        .flatMap(depot -> depot.getVehicles().stream())
        .filter(v -> v.getStatus() != VehicleStatus.REPAIR && v.getCategory() == category)
        .toList();

    List<VrpVehicle> threeWheelers = eligibleVehicles.stream()
        .filter(v -> v.getType() == VehicleType.THREE_WHEELER)
        .map(mapper::mapVrp)
        .toList();

    List<VrpVehicle> compactorTrucks = eligibleVehicles.stream()
        .filter(v -> v.getType() == VehicleType.COMPACTOR_TRUCK)
        .map(mapper::mapVrp)
        .toList();

    List<VrpJob> vrpJobs = orders.stream()
        .map(mapper::mapVrp)
        .toList();

    List<VrpRoute> vrpRoutesThreeWheelers = isDynamic
        ? runningDispatch.getRoutes().stream()
        .filter(route -> route.getVehicle().getType() == VehicleType.THREE_WHEELER && route.getVehicle().getCategory() == category)
        .map(mapper::mapVrp)
        .toList()
        : new ArrayList<>();

    List<VrpRoute> vrpRoutesCompactorTrucks = isDynamic
        ? runningDispatch.getRoutes().stream()
        .filter(route -> route.getVehicle().getType() == VehicleType.COMPACTOR_TRUCK && route.getVehicle().getCategory() == category)
        .map(mapper::mapVrp)
        .toList()
        : new ArrayList<>();

    var assignedJobs = createSubDispatch(threeWheelers, vrpJobs, vrpRoutesThreeWheelers, isDynamic, "driving-car", runningDispatch);

    var remainingJobs = vrpJobs.stream()
        .filter(job -> !assignedJobs.contains(job.getId()))
        .toList();

    createSubDispatch(compactorTrucks, remainingJobs, vrpRoutesCompactorTrucks, isDynamic, "driving-hgv", runningDispatch);

    log.info("Done processing");
  }

  @Transactional
  public void createDispatch() {
    Dispatch runningDispatch = dispatchRepository.findActiveDispatch()
        .orElse(null);

    boolean isDynamic = runningDispatch != null;

    if (!isDynamic) {
      runningDispatch = Dispatch.builder()
          .status(DispatchStatus.IN_PROGRESS)
          .build();
    }

    List<Depot> depots = depotRepository.findAll();

    List<Order> orders = orderRepository.findAllPendingOrdersSorted()
        .stream()
        .toList();

    for (TrashCategory category : TrashCategory.values()) {
      var filteredOrders = orders.stream()
          .filter(order -> order.getCategory() == category)
          .toList();

      processCategory(filteredOrders, category, depots, isDynamic, runningDispatch);
    }

    dispatchRepository.save(runningDispatch);

//
//    List<VrpVehicle> vehicles = depots.stream()
//        .flatMap(depot -> depot.getVehicles().stream().filter(v -> v.getStatus() != VehicleStatus.REPAIR))
//        .map(mapper::mapVrp)
//        .toList();
//
//    List<VrpJob> jobs = orders.stream()
//        .map(mapper::mapVrp)
//        .toList();
//
//    List<VrpRoute> existingRoutes = new ArrayList<>();
//
//    if (isDynamic) {
//      existingRoutes = runningDispatch.getRoutes()
//          .stream()
//          .map(mapper::mapVrp)
//          .toList();
//    }
//
//    VrpRequest vrpRequest = VrpRequest.builder()
//        .vehicles(vehicles)
//        .routes(existingRoutes)
//        .jobs(jobs)
//        .build();
//
//    log.info("Request number of vehicles: {}", vrpRequest.getVehicles().toArray().length);
//    log.info("Request number of routes: {}", vrpRequest.getRoutes().toArray().length);
//    log.info("Request number of jobs: {}", vrpRequest.getJobs().toArray().length);
//
//    VrpResponse vrpResponse = restTemplate.postForObject(vrpApiUrl, vrpRequest, VrpResponse.class);
//
//    if (vrpResponse == null || vrpResponse.getError() != null) {
//      throw new RuntimeException("Vrp api error");
//    }
//
//    if (vrpResponse.getRoutes().isEmpty()) {
//      throw new RuntimeException("No routes updated");
//    }
//
//    log.info("Response number of routes: {}", vrpResponse.getRoutes().toArray().length);
//
//    if (isDynamic) {
//      updateOngoingDispatch(runningDispatch, vrpResponse);
//    } else {
//      createNewDispatch(vrpResponse);
//    }
  }

  private void updateOngoingDispatch(Dispatch dispatch, VrpResponse vrpResponse) {
    log.info("Update ongoing dispatch");
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
          route.setDuration(vrpRoute.getDuration());
          route.setGeometry(vrpRoute.getGeometry());

          return route;
        })
        .toList();

    log.info("Done updating ongoing dispatch");
  }

  private void createNewDispatch(Dispatch dispatch, VrpResponse vrpResponse) {
    log.info("Create new dispatch");
    List<Route> newRoutes = vrpResponse.getRoutes()
        .stream()
        .map(vrpRoute -> buildRouteFromVrp(vrpRoute, dispatch))
        .toList();

    dispatch.getRoutes().addAll(newRoutes);
    log.info("Done create new dispatch");
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
        .duration(vrpRoute.getDuration())
        .status(RouteStatus.IN_PROGRESS)
        .geometry(vrpRoute.getGeometry())
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

  private void notifyOrdersInProgress(List<Order> orders) {
    List<String> fcmTokens = orders.stream()
        .map(order -> order.getUser().getFcmToken())
        .toList();
    notificationService.sendBatchNotifications("Order is in progress", fcmTokens);
  }

  private void notifyNewRoutes(List<Route> routes) {
    List<String> fcmTokens = routes.stream()
        .map(route -> route.getVehicle().getDriver().getFcmToken())
        .toList();
    notificationService.sendBatchNotifications("New route created", fcmTokens);
  }

}
