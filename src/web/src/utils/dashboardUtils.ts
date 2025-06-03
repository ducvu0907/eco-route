import { RouteResponse, VehicleResponse } from "@/types/types";
import mockData from "./mockData";

export const generateDailyOrdersData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    completed: Math.floor(Math.random() * 20) + 10,
    pending: Math.floor(Math.random() * 15) + 5,
    inProgress: Math.floor(Math.random() * 10) + 3,
  }));
};

export const generateRouteEfficiencyData = (routes: RouteResponse[]) => {
  return routes.map((route, _) => ({
    route: `Route ${route.id}`,
    efficiency: Math.round(((route.orders.length * 100) / route.distance) * 10) / 10, // Orders per km efficiency
    distance: route.distance,
    duration: route.duration,
    fuel: Math.round((route.distance * 0.4) * 10) / 10, // Estimated fuel consumption
    orders: route.orders.length
  }));
};

export const generateDispatchHourlyData = () => {
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  return hours.map(hour => ({
    hour,
    dispatches: Math.floor(Math.random() * 4) + 1,
    vehicles: Math.floor(Math.random() * 8) + 3,
    completedOrders: Math.floor(Math.random() * 15) + 5
  }));
};

export const generateWasteCategoryData = () => {
  const categories = ['GENERAL', 'RECYCLABLE', 'ORGANIC', 'HAZARDOUS', 'ELECTRONIC'];
  return categories.map(category => {
    const categoryOrders = mockData.orders.filter(o => o.category === category);
    const weight = categoryOrders.reduce((sum, o) => sum + o.weight, 0);
    return {
      category: category.toLowerCase(),
      weight,
      orders: categoryOrders.length,
      percentage: ((weight / mockData.orders.reduce((sum, o) => sum + o.weight, 0)) * 100).toFixed(1)
    };
  });
};

export const generateVehicleUtilizationData = (vehicles: VehicleResponse[]) => {
  return vehicles.map(vehicle => ({
    vehicle: vehicle.licensePlate,
    utilization: Math.round((vehicle.currentLoad / vehicle.capacity) * 100),
    capacity: vehicle.capacity,
    load: vehicle.currentLoad,
    status: vehicle.status,
    fill: STATUS_COLORS[vehicle.status] || '#8884D8'
  }));
};

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
export const STATUS_COLORS = {
  ACTIVE: '#10B981',
  IDLE: '#3B82F6', 
  REPAIR: '#EF4444'
};
