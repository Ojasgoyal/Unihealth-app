
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar, User, UserCheck, ClipboardList, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch recent appointments for the dashboard
  const { data: recentAppointments = [], isLoading: loadingAppointments } = useQuery({
    queryKey: ["admin-dashboard-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id (
            name,
            specialization
          )
        `)
        .order('appointment_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Status badge styling
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

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hospital Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's a summary of your hospital's status.</p>
        </div>

        {/* Stats Overview with Real Data */}
        <AdminDashboardStats />

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Appointments with Real Data */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Recent Appointments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/appointments")}>
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
                </div>
              ) : recentAppointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center font-medium">
                                <Calendar className="mr-1 h-4 w-4" />
                                {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {appointment.start_time?.substring(0, 5)} - {appointment.end_time?.substring(0, 5)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {appointment.doctor?.name || "Unknown"}
                            <div className="text-xs text-muted-foreground">
                              {appointment.doctor?.specialization}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${getStatusBadge(appointment.status)}`}>
                              {appointment.status}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No appointments</h3>
                  <p className="text-sm text-muted-foreground">
                    There are no recent appointments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Doctor Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">Active Doctors</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/doctors")}>
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActiveDoctorsList />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Component to show active doctors
const ActiveDoctorsList = () => {
  const { data: activeDoctors = [], isLoading } = useQuery({
    queryKey: ["active-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('available', true)
        .limit(5);
      
      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-primary"></div>
      </div>
    );
  }

  if (activeDoctors.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No active doctors</h3>
        <p className="text-sm text-muted-foreground">
          There are no active doctors at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {activeDoctors.map((doctor) => (
        <div 
          key={doctor.id}
          className="flex items-center p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{doctor.name}</p>
            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
          </div>
          <div className="ml-auto text-sm">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-muted-foreground">Available</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
