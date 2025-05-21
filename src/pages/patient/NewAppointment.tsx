
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { useAuth } from "@/contexts/AuthContext";

const NewAppointment = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const selectedDoctor = location.state?.selectedDoctor;
  
  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">Fill in the details to schedule your appointment</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Select your doctor, preferred date and time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm 
              initialDoctor={selectedDoctor} 
              patientId={profile?.id} 
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
