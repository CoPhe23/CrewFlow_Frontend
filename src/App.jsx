import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { Login } from "../pages/login";
import { Register } from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Home from "../pages/Home";
import EventPage from "../pages/EventPage";
import SchedulePage from "../pages/SchedulePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event/:id"
        element={
          <ProtectedRoute>
            <EventPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event/:id/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;