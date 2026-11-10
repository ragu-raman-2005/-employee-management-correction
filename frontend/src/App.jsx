
import { Navigate, Route, Routes } from "react-router-dom";
import EmployeeOnboarding from "./pages/EmployeeOnboarding";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          user ? <Navigate to="/" /> : <Register />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/onboarding" element={<EmployeeOnboarding />}
/>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
