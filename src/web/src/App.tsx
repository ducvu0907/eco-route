import { Route, Routes } from "react-router";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Navigate } from "react-router";
import Dashboard from "./pages/Dashboard";
import Layout from "./pages/Layout";
import { useAuthContext } from "./hooks/useAuthContext";
import DepotsListPage from "./pages/depot/DepotsListPage";

const App = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>

      <Route element={isAuthenticated && <Navigate to={"/"}/>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={!isAuthenticated ? <Navigate to={"/login"}/> : <Layout />}>
        <Route path="/" element={<Navigate to="/dashboard"/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/depots" element={<DepotsListPage />}/>

      </Route>

      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  )
}

export default App;