
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, UserCheck, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Appointment type - extend as needed
interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  doctor?: {
    name: string;
    specialization: string;
  };
  patient?: {
    first_name?: string;
    last_name?: string;
  };
}

const AppointmentsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all appointments with doctor details
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["admin-appointments", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id (name, specialization)
        `)
        .order('appointment_date', { ascending: false });
      
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      console.log("Appointments data:", data);
      
      // Since we don't have profiles table with patient info yet, we'll fake it
      return data.map(appointment => ({
        ...appointment,
        patient: {
          first_name: `Patient`,
          last_name: `${appointment.patient_id.substring(0, 4)}`
        }
      }));
    }
  });

  // Update appointment status mutation
  const updateAppointmentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast({
        title: "Status updated",
        description: "The appointment status has been updated successfully."
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment status. Please try again."
      });
    }
  });

  // Filter appointments based on the selected tab
  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === "all") return true;
    const today = new Date().toISOString().split('T')[0];
    const appointmentDate = appointment.appointment_date;
    
    switch (activeTab) {
      case "upcoming":
        return appointmentDate > today && appointment.status !== "cancelled";
      case "today":
        return appointmentDate === today && appointment.status !== "cancelled";
      case "past":
        return appointmentDate < today || appointment.status === "completed";
      case "cancelled":
        return appointment.status === "cancelled";
      default:
        return true;
    }
  });

  const handleOpenStatusDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = (status: string) => {
    if (selectedAppointment) {
      updateAppointmentStatus.mutate({ id: selectedAppointment.id, status });
    }
  };

  // Get status badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "confirmed":
        return <UserCheck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointments Management</h1>
            <p className="text-muted-foreground">View and manage all patient appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter by Status</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-5 w-[600px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-primary"></div>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {appointment.start_time.substring(0, 5)} - {appointment.end_time.substring(0, 5)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {appointment.patient 
                              ? `${appointment.patient.first_name || ''} ${appointment.patient.last_name || ''}`
                              : appointment.patient_id.substring(0, 8)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {appointment.doctor?.name || "Unknown"}
                            <p className="text-xs text-muted-foreground">
                              {appointment.doctor?.specialization}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {appointment.reason || "No reason provided"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 font-medium ${getStatusBadge(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenStatusDialog(appointment)}
                          >
                            Update Status
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
                <h3 className="mt-4 text-lg font-medium">No appointments found</h3>
                <p className="mt-1 text-gray-500">
                  No appointments match the current filter criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Change the status for this appointment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="border rounded-md p-3 bg-muted/30">
                <p><strong>Date:</strong> {format(new Date(selectedAppointment.appointment_date), 'MMM dd, yyyy')}</p>
                <p><strong>Time:</strong> {selectedAppointment.start_time.substring(0, 5)} - {selectedAppointment.end_time.substring(0, 5)}</p>
                <p><strong>Doctor:</strong> {selectedAppointment.doctor?.name}</p>
                <p><strong>Current Status:</strong> {selectedAppointment.status}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">New Status:</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={selectedAppointment.status === "pending" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus("pending")}
                    className="w-full justify-start"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Pending
                  </Button>
                  <Button 
                    variant={selectedAppointment.status === "confirmed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus("confirmed")}
                    className="w-full justify-start"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Confirmed
                  </Button>
                  <Button 
                    variant={selectedAppointment.status === "completed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus("completed")}
                    className="w-full justify-start"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                  <Button 
                    variant={selectedAppointment.status === "cancelled" ? "destructive" : "outline"}
                    onClick={() => handleUpdateStatus("cancelled")}
                    className={`w-full justify-start ${selectedAppointment.status === "cancelled" ? "" : "text-destructive"}`}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AppointmentsManagement;
