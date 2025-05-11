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
import DepotCreate from "./pages/depot/DepotCreate";
import 'leaflet/dist/leaflet.css';

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
        <Route path="/depots" element={<DepotManagement />}/>
        <Route path="/create-depot" element={<DepotCreate />}/>
        <Route path="/users" element={<UserManagement />}/>
        <Route path="/orders" element={<OrderManagement />}/>
        <Route path="/map" element={<Map />}/>

      </Route>

      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App;