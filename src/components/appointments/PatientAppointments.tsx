
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, Clock, X } from "lucide-react";
import { 
  getAppointmentsForPatient, 
  AppointmentWithDoctor, 
  updateAppointmentStatus
} from "@/services/appointmentsService";
import { format, parseISO } from "date-fns";

interface PatientAppointmentsProps {
  limit?: number;
}

export const PatientAppointments = ({ limit }: PatientAppointmentsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getAppointmentsForPatient(user.id);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user, toast]);

  const handleCancelAppointment = async (id: string) => {
    try {
      await updateAppointmentStatus(id, "cancelled");
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully",
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    }
  };

  const displayedAppointments = limit 
    ? appointments.slice(0, limit) 
    : appointments;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return "bg-green-100 text-green-800";
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'cancelled': return "bg-red-100 text-red-800";
      case 'completed': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">Loading appointments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Appointments</CardTitle>
            <CardDescription>Upcoming and recent appointments</CardDescription>
          </div>
          <Calendar className="h-5 w-5 text-healthcare-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {displayedAppointments.length > 0 ? (
          <div className="space-y-6">
            {displayedAppointments.map((appointment) => (
              <div key={appointment.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{appointment.doctor?.name}</p>
                    <p className="text-sm text-gray-500">{appointment.doctor?.specialization}</p>
                  </div>
                  <div className="text-right">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                  </span>
                  <Clock className="h-4 w-4 ml-2 text-gray-500" />
                  <span>
                    {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
                  </span>
                </div>
                {appointment.reason && (
                  <p className="text-sm text-gray-600">Reason: {appointment.reason}</p>
                )}
                {appointment.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleCancelAppointment(appointment.id)}
                  >
                    <X className="mr-1 h-3 w-3" /> Cancel
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </CardContent>
      {limit && appointments.length > limit && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {/* Navigate to full appointments page */}}
          >
            View All Appointments
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
