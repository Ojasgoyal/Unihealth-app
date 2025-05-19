
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, FileText, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPatientAppointments, Appointment } from "@/services/appointmentsService";
import { format, parseISO } from "date-fns";

// Helper function to format time
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

const Appointments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Hardcoded patient ID for demo - in a real app, this would come from authentication context
  const patientId = "123e4567-e89b-12d3-a456-426614174000";
  
  // Fetch patient appointments
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['patientAppointments', patientId],
    queryFn: () => getPatientAppointments(patientId),
  });
  
  // Filter appointments based on active tab
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppointments = appointments.filter(app => {
    const appDate = new Date(app.appointment_date);
    return (appDate >= today && app.status !== 'cancelled');
  });
  
  const pastAppointments = appointments.filter(app => {
    const appDate = new Date(app.appointment_date);
    return (appDate < today || app.status === 'completed');
  });
  
  const cancelledAppointments = appointments.filter(app => 
    app.status === 'cancelled'
  );
  
  if (error) {
    toast({
      title: "Error loading appointments",
      description: "There was a problem loading your appointments.",
      variant: "destructive",
    });
  }
  
  // Navigate to book new appointment
  const handleBookNew = () => {
    navigate("/patient/find-doctor");
  };
  
  // View appointment details
  const handleViewDetails = (appointment: Appointment) => {
    navigate(`/patient/appointments/${appointment.id}`);
  };

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground">View and manage your healthcare appointments</p>
          </div>
          <Button 
            onClick={handleBookNew} 
            className="bg-healthcare-primary"
          >
            <Plus className="mr-2 h-4 w-4" /> Book New Appointment
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>
              Your scheduled and past appointments with healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled ({cancelledAppointments.length})
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                {isLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-primary"></div>
                  </div>
                ) : (
                  <>
                    <TabsContent value="upcoming">
                      {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingAppointments.map((appointment) => (
                            <div 
                              key={appointment.id} 
                              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    Dr. {appointment.doctor?.name || "Unknown Doctor"}
                                  </h3>
                                  <p className="text-healthcare-primary">
                                    {appointment.doctor?.specialization}
                                  </p>
                                  <div className="flex items-center gap-6 mt-2">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                      <span className="text-sm">
                                        {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                      <span className="text-sm">
                                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex md:flex-col items-center gap-2">
                                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                  </span>
                                  <Button variant="ghost" size="sm" onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(appointment);
                                  }}>
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No upcoming appointments</h3>
                          <p className="mt-1 text-gray-500">Book an appointment with one of our healthcare providers</p>
                          <Button 
                            className="mt-4"
                            variant="outline"
                            onClick={handleBookNew}
                          >
                            Find a Doctor
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="past">
                      {pastAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {pastAppointments.map((appointment) => (
                            <div 
                              key={appointment.id} 
                              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => handleViewDetails(appointment)}
                            >
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    Dr. {appointment.doctor?.name || "Unknown Doctor"}
                                  </h3>
                                  <p className="text-healthcare-primary">
                                    {appointment.doctor?.specialization}
                                  </p>
                                  <div className="flex items-center gap-6 mt-2">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                      <span className="text-sm">
                                        {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex md:flex-col items-center gap-2">
                                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                    Completed
                                  </span>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center gap-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Navigate to view prescription
                                      navigate(`/patient/prescriptions?appointmentId=${appointment.id}`);
                                    }}
                                  >
                                    <FileText className="h-3 w-3" />
                                    View Prescription
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Clock className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No past appointments</h3>
                          <p className="mt-1 text-gray-500">Your completed appointments will appear here</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="cancelled">
                      {cancelledAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {cancelledAppointments.map((appointment) => (
                            <div 
                              key={appointment.id} 
                              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div>
                                  <h3 className="font-medium text-lg">
                                    Dr. {appointment.doctor?.name || "Unknown Doctor"}
                                  </h3>
                                  <p className="text-healthcare-primary">
                                    {appointment.doctor?.specialization}
                                  </p>
                                  <div className="flex items-center gap-6 mt-2">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                      <span className="text-sm">
                                        {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                    Cancelled
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No cancelled appointments</h3>
                          <p className="mt-1 text-gray-500">You have not cancelled any appointments</p>
                        </div>
                      )}
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
