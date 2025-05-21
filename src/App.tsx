
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

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

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        
        {/* Auth Routes - non-authenticated users only */}
        <Route element={<ProtectedRoute requireAuth={false} redirectPath="/" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Patient Routes - patient role only */}
        <Route element={<ProtectedRoute requiredRole="patient" />}>
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient/find-doctor" element={<FindDoctor />} />
          <Route path="/patient/appointments/new" element={<NewAppointment />} />
          <Route path="/patient/appointments" element={<Appointments />} />
          <Route path="/patient/prescriptions" element={<Prescriptions />} />
        </Route>

        {/* Admin/Hospital Routes - hospital or doctor roles only */}
        <Route 
          element={
            <ProtectedRoute 
              requireAuth={true}
              redirectPath="/patient-dashboard" 
            />
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<DoctorsManagement />} />
          <Route path="/admin/prescriptions" element={<PrescriptionsManagement />} />
          <Route path="/admin/appointments" element={<AppointmentsManagement />} />
        </Route>

        {/* Redirects */}
        <Route 
          path="/dashboard" 
          element={
            <Navigate 
              to="/patient-dashboard" 
              replace 
            />
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
