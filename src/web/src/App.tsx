import { Route, Routes } from "react-router";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import { useAuthContext } from "./hooks/useAuthContext";
import DepotManagement from "./pages/depot/DepotManagement";
import UserManagement from "./pages/user/UserManagement";
import OrderManagement from "./pages/order/OrderManagement";
import 'leaflet/dist/leaflet.css';
import DepotDetails from "./pages/depot/DepotDetails";
import UserDetails from "./pages/user/UserDetails";
import VehicleManagement from "./pages/vehicle/VehicleManagement";
import DispatchManagement from "./pages/dispatch/DispatchManagement";
import VehicleDetails from "./pages/vehicle/VehicleDetails";
import OrderDetails from "./pages/order/OrderDetails";
import { useEffect, useState } from "react";
import DispatchDetails from "./pages/dispatch/DispatchDetails";
import Map from "./pages/map/Map";
import CurrentDispatchDetails from "./pages/dispatch/CurrentDispatchDetails";
import { getToken, onMessage } from "firebase/messaging";
import { generateToken, messaging } from "./firebase";
import { useToast } from "./hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";

const App = () => {
  const queryClient = useQueryClient();
  const {showToast} = useToast();
  const { token, username, userId, role, setAuth, isAuthenticated } = useAuthContext();

  useEffect(() => {
    generateToken()
      .then((fcmToken) => {
        if (fcmToken) {
          setAuth({token, username, userId, role, fcmToken});
        }
      });

    onMessage(messaging, (payload) => {
      queryClient.invalidateQueries(); // no args = invalidating all
      showToast(payload.notification?.body as string, "success");
      console.log("Received foreground message: ", payload);
    });
    
  }, []);


  return (
    <Routes>

      <Route element={isAuthenticated && <Navigate to={"/"}/>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={!isAuthenticated ? <Navigate to={"/login"}/> : <Layout />}>

        <Route path="/" element={<Navigate to="/dashboard"/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>

        <Route path="/dispatches" element={<DispatchManagement />}/>
        <Route path="/dispatches/:dispatchId" element={<DispatchDetails />}/>
        <Route path="/dispatches/current" element={<CurrentDispatchDetails />}/>

        <Route path="/vehicles" element={<VehicleManagement />}/>
        <Route path="/vehicles/:vehicleId" element={<VehicleDetails />}/>

        <Route path="/depots" element={<DepotManagement />}/>
        <Route path="/depots/:depotId" element={<DepotDetails />}/>

        <Route path="/users" element={<UserManagement />}/>
        <Route path="/users/:userId" element={<UserDetails />}/>

        <Route path="/orders" element={<OrderManagement />}/>
        <Route path="/orders/:orderId" element={<OrderDetails />}/>

        <Route path="/map" element={<Map />} />

      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App;