
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useLocation } from "react-router-dom";

const NewAppointment = () => {
  const location = useLocation();
  const { profile } = useAuth();
  
  // Extract the doctor data if it was passed via navigation state
  const initialDoctor = location.state?.doctor || null;
  
  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Book an Appointment</h1>
          <p className="text-sm text-muted-foreground">
            Schedule an appointment with your preferred doctor
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>
              Fill in the information below to book your appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profile && (
              <AppointmentForm
                initialDoctor={initialDoctor}
                patientId={profile.id}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
