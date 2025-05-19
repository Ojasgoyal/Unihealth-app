
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorsManagement from "./pages/admin/DoctorsManagement";
import FindDoctor from "./pages/patient/FindDoctor";
import NewAppointment from "./pages/patient/NewAppointment";
import Appointments from "./pages/patient/Appointments";
import Prescriptions from "./pages/patient/Prescriptions";
import PrescriptionsManagement from "./pages/admin/PrescriptionsManagement";
import AppointmentsManagement from "./pages/admin/AppointmentsManagement";

// For demo purposes, allow access to admin pages
const AdminRoute = () => {
  return <Outlet />;
};

// Auth Routes
const AuthenticatedRoute = () => {
  return <Outlet />;
};

// Public Routes
const PublicRoute = () => {
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<AuthenticatedRoute />}>
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient/find-doctor" element={<FindDoctor />} />
        <Route path="/patient/appointments/new" element={<NewAppointment />} />
        <Route path="/patient/appointments" element={<Appointments />} />
        <Route path="/patient/prescriptions" element={<Prescriptions />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<DoctorsManagement />} />
        <Route path="/admin/prescriptions" element={<PrescriptionsManagement />} />
        <Route path="/admin/appointments" element={<AppointmentsManagement />} />
      </Route>

      {/* Redirects */}
      <Route path="/dashboard" element={<Navigate to="/patient-dashboard" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
