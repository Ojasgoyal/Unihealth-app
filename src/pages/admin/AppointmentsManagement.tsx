
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAppointments, updateAppointmentStatus, Appointment } from "@/services/appointmentsService";
import AppointmentsTable from "@/components/admin/AppointmentsTable";
import UpdateStatusDialog from "@/components/admin/UpdateStatusDialog";

const AppointmentsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["admin-appointments", statusFilter],
    queryFn: async () => {
      const allAppointments = await getAllAppointments();
      if (statusFilter !== "all") {
        return allAppointments.filter(app => app.status === statusFilter);
      }
      return allAppointments;
    }
  });

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      updateAppointmentStatus(id, status as 'pending' | 'confirmed' | 'completed' | 'cancelled'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast({
        title: "Status updated",
        description: "The appointment status has been updated successfully."
      });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
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
      updateStatusMutation.mutate({ id: selectedAppointment.id, status });
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
              <AppointmentsTable 
                appointments={filteredAppointments} 
                onUpdateStatus={handleOpenStatusDialog}
              />
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
      <UpdateStatusDialog 
        appointment={selectedAppointment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onStatusChange={handleUpdateStatus}
      />
    </DashboardLayout>
  );
};

export default AppointmentsManagement;
