
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PatientAppointments } from "@/components/appointments/PatientAppointments";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { getDoctors, Doctor } from "@/services/doctorsService";
import { createAppointment } from "@/services/appointmentsService";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";

const Appointments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast({
          title: "Error",
          description: "Failed to load doctors list",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [toast]);

  const handleCreateAppointment = async (appointmentData: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }) => {
    if (!user) return;
    
    try {
      await createAppointment({
        patient_id: user.id,
        doctor_id: appointmentData.doctorId,
        appointment_date: appointmentData.date,
        start_time: appointmentData.startTime,
        end_time: appointmentData.endTime,
        reason: appointmentData.reason,
        status: 'pending'
      });
      
      toast({
        title: "Appointment booked",
        description: "Your appointment has been scheduled successfully",
      });
      
      setFormOpen(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Booking failed",
        description: "Failed to book your appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Your Appointments</h1>
            <p className="text-muted-foreground">
              Manage your upcoming and past appointments
            </p>
          </div>
          <Button 
            className="bg-healthcare-primary"
            onClick={() => setFormOpen(true)}
            disabled={loading}
          >
            <Plus className="mr-2 h-4 w-4" /> Book New Appointment
          </Button>
        </div>

        <PatientAppointments />

        <AppointmentForm 
          open={formOpen}
          onOpenChange={setFormOpen}
          doctors={doctors}
          onSubmit={handleCreateAppointment}
        />
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
