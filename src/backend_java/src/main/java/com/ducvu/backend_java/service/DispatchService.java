package com.ducvu.backend_java.service;

import com.ducvu.backend_java.dto.request.VrpRequest;
import com.ducvu.backend_java.dto.response.DispatchResponse;
import com.ducvu.backend_java.dto.response.VrpResponse;
import com.ducvu.backend_java.model.*;
import com.ducvu.backend_java.repository.*;
import com.ducvu.backend_java.util.Mapper;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import io.minio.errors.ErrorResponseException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
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
  private final List<Order> ordersToNotify = new ArrayList<>();
  private final List<Route> routesToNotify = new ArrayList<>();

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

    List<Route> routes = isDynamic ? runningDispatch.getRoutes() : new ArrayList<>();
    List<Depot> depots = depotRepository.findAll();

    List<Vehicle> vehicles = vehicleRepository.findAll().stream()
        .filter(v -> v.getStatus() != VehicleStatus.REPAIR)
        .toList();

    List<Order> orders = orderRepository.findAllPendingOrdersSorted()
        .stream()
        .toList();

    for (TrashCategory category : TrashCategory.values()) {
      var filteredOrders = orders.stream()
          .filter(order -> order.getCategory() == category)
          .toList();
      var filteredVehicles = vehicles.stream()
          .filter(v -> v.getCategory() == category)
          .toList();

      if (filteredOrders.isEmpty()) {
        log.warn("No orders for this category: {}", category);
        continue;
      }

      if (filteredVehicles.isEmpty()) {
        log.warn("No vehicles for this category: {}", category);
        continue;
      }

      processCategory(filteredOrders, filteredVehicles, runningDispatch, isDynamic);
    }

    dispatchRepository.save(runningDispatch);

    notifyOrdersInProgress(ordersToNotify);
    notifyNewRoutes(routesToNotify);

    ordersToNotify.clear();
    routesToNotify.clear();
  }

  // create routes for one category
  private void processCategory(List<Order> orders, List<Vehicle> vehicles, Dispatch dispatch, boolean isDynamic) {
    // solve for three-wheeler
    List<VrpJob> vrpJobs = orders.stream()
        .map(mapper::mapVrp)
        .toList();

    List<Vehicle> threeWheelers = vehicles.stream()
        .filter(v -> v.getType() == VehicleType.THREE_WHEELER)
        .toList();

    List<VrpVehicle> vrpThreeWheelers = threeWheelers.stream()
        .map(mapper::mapVrp)
        .toList();

    List<Depot> threeWheelerDepots = threeWheelers.stream()
        .map(v -> v.getDepot())
        .distinct()
        .toList();

    List<VrpRoute> threeWheelerRoutes = threeWheelers.stream()
        .flatMap(v -> v.getRoutes().stream())
        .filter(r -> r.getStatus() == RouteStatus.IN_PROGRESS)
        .map(mapper::mapVrp)
        .toList();

    List<Vehicle> compactorTrucks = vehicles.stream()
        .filter(v -> v.getType() == VehicleType.COMPACTOR_TRUCK)
        .toList();

    List<VrpRoute> compactorTruckRoutes = compactorTrucks.stream()
        .flatMap(v -> v.getRoutes().stream())
        .filter(r -> r.getStatus() == RouteStatus.IN_PROGRESS)
        .map(mapper::mapVrp)
        .toList();

    List<VrpVehicle> vrpCompactorTrucks = compactorTrucks.stream()
        .map(mapper::mapVrp)
        .toList();

    List<Depot> compactorTruckDepots = compactorTrucks.stream()
        .map(v -> v.getDepot())
        .distinct()
        .toList();

    List<VrpDepot> vrpThreeWheelersDepots = threeWheelerDepots.stream()
        .map(mapper::mapVrp)
        .toList();

    List<VrpDepot> vrpCompactorTrucksDepots = compactorTruckDepots.stream()
        .map(mapper::mapVrp)
        .toList();


    List<VrpJob> unassignedJobs = vrpJobs;
    if (!unassignedJobs.isEmpty() && !vrpThreeWheelers.isEmpty()) {
      VrpResponse res1 = vrpMiddleware(vrpJobs, vrpThreeWheelers, vrpThreeWheelersDepots, threeWheelerRoutes);
      unassignedJobs = res1.getUnassigned();
      if (isDynamic) {
        updateRoutes(res1, dispatch);
      } else {
        createRoutes(res1, dispatch);
      }
    }

    if (!unassignedJobs.isEmpty() && !vrpCompactorTrucks.isEmpty()) {
      VrpResponse res2 = vrpMiddleware(unassignedJobs, vrpCompactorTrucks, vrpCompactorTrucksDepots, compactorTruckRoutes);
      if (isDynamic) {
        updateRoutes(res2, dispatch);
      } else {
        createRoutes(res2, dispatch);
      }
    }

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

    ordersToNotify.addAll(orders);
    // notifyOrdersInProgress(orders);
    return orders;
  }

  private void updateRoutes(VrpResponse vrpResponse, Dispatch dispatch) {
    List<Route> updatedRoutes = vrpResponse.getRoutes().stream()
        .map(vrpRoute -> {
          Vehicle vehicle = vehicleRepository.findById(vrpRoute.getVehicleId())
              .orElseThrow(() -> new RuntimeException("Vehicle not found"));
          if (vehicle.getStatus() != VehicleStatus.ACTIVE) {
            vehicle.setStatus(VehicleStatus.ACTIVE);
            Route route = buildRouteFromVrp(vrpRoute, dispatch);
            dispatch.getRoutes().add(route);
            return route;
          } else {
            Route route = routeRepository.findByDispatchIdAndVehicleId(dispatch.getId(), vehicle.getId())
                .orElseThrow(() -> new RuntimeException("Route not found"));
            route.setOrders(buildOrders(vrpRoute, route));
            route.setDistance(vrpRoute.getDistance());
            route.setDuration(vrpRoute.getDuration());
            route.setGeometry(vrpRoute.getGeometry());

            return route;
          }

        })
        .toList();

    routesToNotify.addAll(updatedRoutes);
    // notifyNewRoutes(updatedRoutes);
  }

  private Route buildRouteFromVrp(VrpRoute vrpRoute, Dispatch dispatch) {
    Vehicle vehicle = vehicleRepository.findById(vrpRoute.getVehicleId())
        .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    vehicle.setStatus(VehicleStatus.ACTIVE);

    Route route = Route.builder()
        .vehicle(vehicle)
        .dispatch(dispatch)
        .distance(vrpRoute.getDistance())
        .duration(vrpRoute.getDuration())
        .geometry(vrpRoute.getGeometry())
        .status(RouteStatus.IN_PROGRESS)
        .build();

    route.setOrders(buildOrders(vrpRoute, route));
    return route;
  }

  private void createRoutes(VrpResponse vrpResponse, Dispatch dispatch) {
    List<Route> routes = vrpResponse.getRoutes().stream()
        .map(vrpRoute -> buildRouteFromVrp(vrpRoute, dispatch))
        .toList();

    routesToNotify.addAll(routes);
    // notifyNewRoutes(routes);
    dispatch.getRoutes().addAll(routes);
  }

  private VrpResponse vrpMiddleware(List<VrpJob> jobs, List<VrpVehicle> vehicles, List<VrpDepot> depots,  List<VrpRoute> routes) {
    VrpRequest request = VrpRequest.builder()
        .jobs(jobs)
        .depots(depots)
        .vehicles(vehicles)
        .routes(routes)
        .build();

    log.info("Number of vehicles: {}", request.getVehicles().size());
    log.info("Number of depots: {}", request.getDepots().size());

    VrpResponse response = restTemplate.postForObject(vrpApiUrl, request, VrpResponse.class);

    if (response == null || response.getError() != null) {
      throw new RuntimeException("Error while solving vrp");
    }

    return response;
  }


  private void notifyOrdersInProgress(List<Order> orders) {
    List<User> users = orders.stream()
        .map(order -> order.getUser())
        .toList();
    notificationService.sendBatchNotifications("Order is in progress", users);
  }

  private void notifyNewRoutes(List<Route> routes) {
    List<User> drivers = routes.stream()
        .map(route -> route.getVehicle().getDriver())
        .toList();
    notificationService.sendBatchNotifications("New route created", drivers);
  }

}
