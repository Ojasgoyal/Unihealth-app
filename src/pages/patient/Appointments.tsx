import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, FileText, Plus, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPatientAppointments, Appointment } from "@/services/appointmentsService";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
import { useAuth } from "@/contexts/AuthContext";

// Helper function to render status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const Appointments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const { profile } = useAuth();
  // Hardcoded patient ID for demo - in a real app, this would come from authentication context
  const patientId = profile?.id;  
  // Fetch patient appointments
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['patientAppointments', patientId],
    queryFn: () => getPatientAppointments(patientId),
    // Only run the query if we have a patient ID
    enabled: !!patientId,
  });
  
  // Filter appointments based on the selected tab
  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === "all") return true;
    const today = new Date().toISOString().split('T')[0];
    const appointmentDate = appointment.appointment_date;
    
    switch (activeTab) {
      case "upcoming":
        return appointmentDate > today && appointment.status !== "cancelled";
      case "today":  // Add this case
        return appointmentDate === today && appointment.status !== "cancelled";
      case "past":
        return appointmentDate < today || appointment.status === "completed";
      case "cancelled":
        return appointment.status === "cancelled";
      default:
        return true;
    }
  });
  
  // Add a count for today's appointments
  const todayCount = appointments.filter(app => {
    const today = new Date().toISOString().split('T')[0];
    return app.appointment_date === today && app.status !== "cancelled";
  }).length;
  
  const upcomingCount = appointments.filter(app => {
    const today = new Date().toISOString().split('T')[0];
    return app.appointment_date > today && app.status !== "cancelled";
  }).length;
  
  const pastCount = appointments.filter(app => {
    const today = new Date().toISOString().split('T')[0];
    return app.appointment_date < today || app.status === "completed";
  }).length;
  
  const cancelledCount = appointments.filter(app => 
    app.status === "cancelled"
  ).length;
  
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingCount})
                </TabsTrigger>
                <TabsTrigger value="today">
                  Today ({todayCount})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastCount})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Cancelled ({cancelledCount})
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
                      {filteredAppointments.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell className="font-medium">
                                    <div>
                                      <p>{appointment.doctor?.name || "Unknown Doctor"}</p>
                                      <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                  </TableCell>
                                  <TableCell>
                                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(appointment.status)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() => handleViewDetails(appointment)}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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
                    
                    <TabsContent value="today">
                      {filteredAppointments.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell className="font-medium">
                                    <div>
                                      <p>{appointment.doctor?.name || "Unknown Doctor"}</p>
                                      <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                  </TableCell>
                                  <TableCell>
                                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(appointment.status)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() => handleViewDetails(appointment)}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="mt-4 text-lg font-medium">No appointments today</h3>
                          <p className="mt-1 text-gray-500">You don't have any appointments scheduled for today</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="past">
                      {filteredAppointments.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell className="font-medium">
                                    <div>
                                      <p>{appointment.doctor?.name || "Unknown Doctor"}</p>
                                      <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                  </TableCell>
                                  <TableCell>
                                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(appointment.status)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={() => handleViewDetails(appointment)}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        Details
                                      </Button>
                                      {appointment.status === 'completed' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1"
                                          onClick={() => navigate(`/patient/prescriptions?appointmentId=${appointment.id}`)}
                                        >
                                          <FileText className="h-4 w-4" />
                                          Prescription
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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
                      {filteredAppointments.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredAppointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell className="font-medium">
                                    <div>
                                      <p>{appointment.doctor?.name || "Unknown Doctor"}</p>
                                      <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(appointment.appointment_date), "MMM d, yyyy")}
                                  </TableCell>
                                  <TableCell>
                                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(appointment.status)}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() => handleViewDetails(appointment)}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      Details
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
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