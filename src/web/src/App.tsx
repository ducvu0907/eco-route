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
import Map from "./pages/map/Map";
import 'leaflet/dist/leaflet.css';
import DepotDetails from "./pages/depot/DepotDetails";
import UserDetails from "./pages/user/UserDetails";
import VehicleManagement from "./pages/vehicle/VehicleManagement";
import DispatchManagement from "./pages/dispatch/DispatchManagement";

const App = () => {
  const { isAuthenticated } = useAuthContext();

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

        <Route path="/vehicles" element={<VehicleManagement />}/>

        <Route path="/depots" element={<DepotManagement />}/>
        <Route path="/depots/:depotId" element={<DepotDetails />}/>

        <Route path="/users" element={<UserManagement />}/>
        <Route path="/users/:userId" element={<UserDetails />}/>

        <Route path="/orders" element={<OrderManagement />}/>

      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App;