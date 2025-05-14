
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllAppointments } from "@/services/appointmentsService";
import { format } from "date-fns";

export const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        // Get today's appointments only
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = data.filter(
          app => app.appointment_date === today
        ).slice(0, 5); // Limit to 5 appointments
        
        setAppointments(todaysAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Recent patient appointments</CardDescription>
          </div>
          <Calendar className="h-5 w-5 text-healthcare-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    {appointment.patient?.first_name} {appointment.patient?.last_name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{appointment.doctor?.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p>{appointment.start_time.slice(0, 5)}</p>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === "confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-muted-foreground">No appointments scheduled for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
