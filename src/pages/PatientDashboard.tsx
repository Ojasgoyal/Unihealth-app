import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, FileText, Search, ArrowRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/doctorsService";
import { getPatientAppointments } from "@/services/appointmentsService";
import { getPatientPrescriptions } from "@/services/prescriptionsService";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const PatientDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Get the actual patient ID from auth context
  const patientId = profile?.id;
  
  // Fetch a few doctors for recommendations
  const { data: doctors = [] } = useQuery({
    queryKey: ['recommendedDoctors'],
    queryFn: getDoctors,
    select: (data) => data.filter(d => d.available).slice(0, 3),
  });
  
  // Fetch patient's upcoming appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ['dashboardAppointments', patientId],
    queryFn: () => getPatientAppointments(patientId),
    select: (data) => {
      // Filter to get only upcoming appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return data
        .filter(app => {
          const appDate = new Date(app.appointment_date);
          return (appDate >= today && app.status !== 'cancelled');
        })
        .slice(0, 2); // Show only first 2
    },
    enabled: !!patientId,
  });
  
  // Fetch patient's prescriptions
  const { data: prescriptions = [] } = useQuery({
    queryKey: ['dashboardPrescriptions', patientId],
    queryFn: () => getPatientPrescriptions(patientId),
    select: (data) => data.slice(0, 2), // Show only the 2 most recent prescriptions
    enabled: !!patientId,
  });

  // Format time from database format
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    
    // If timeString is already formatted as "HH:MM AM/PM", return it as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }
    
    // Parse time string (assuming format like "14:30:00")
    const [hours, minutes] = timeString.split(":").map(Number);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {profile?.first_name || "Patient"}</h1>
          <p className="text-muted-foreground">Here's an overview of your healthcare information.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Find a Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <Search className="h-10 w-10 mb-2 text-healthcare-primary" />
              <p className="text-sm text-gray-500">Search for doctors by specialty or location</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate("/patient/find-doctor")}
              >
                Search Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Book an Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className="h-10 w-10 mb-2 text-healthcare-primary" />
              <p className="text-sm text-gray-500">Schedule a visit with your healthcare provider</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate("/patient/appointments/new")}
              >
                Book Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">View Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <FileText className="h-10 w-10 mb-2 text-healthcare-primary" />
              <p className="text-sm text-gray-500">Access your medication history and active prescriptions</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate("/patient/prescriptions")}
              >
                View All
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Appointment and Prescriptions Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Upcoming Appointments */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled doctor visits</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-healthcare-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-6">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {appointment.doctor?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.doctor?.specialization || "Specialist"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(appointment.start_time)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>Central Hospital</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming appointments</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => navigate("/patient/find-doctor")}
                  >
                    Schedule one now
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/patient/appointments")}
              >
                View All Appointments
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Prescriptions */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Prescriptions</CardTitle>
                  <CardDescription>Your medication history</CardDescription>
                </div>
                <FileText className="h-5 w-5 text-healthcare-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {prescriptions.length > 0 ? (
                <div className="space-y-6">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{prescription.doctor?.name || "Unknown"}</p>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(prescription.issue_date), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            prescription.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {prescription.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Medications:</p>
                        <ul className="text-sm text-gray-500">
                          {prescription.medications.map((med, i) => (
                            <li key={i}>{med}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-500 mt-1">{prescription.instructions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No prescription history</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/patient/prescriptions")}
              >
                View All Prescriptions
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recommended Doctors */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Recommended Doctors</CardTitle>
            <CardDescription>Available healthcare professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {doctors.length > 0 ? doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1">Central Hospital</p>
                  <p className="text-xs mt-2 text-healthcare-primary">
                    {doctor.available ? "Available Now" : "Currently Unavailable"}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => navigate("/patient/find-doctor")}
                  >
                    View Profile <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              )) : (
                <div className="col-span-3 text-center py-6">
                  <p className="text-gray-500">Loading recommended doctors...</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/patient/find-doctor")}
            >
              Find More Doctors
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
