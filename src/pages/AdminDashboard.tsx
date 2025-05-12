
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { AppointmentsList } from "@/components/dashboard/AppointmentsList";
import { BedAvailability } from "@/components/dashboard/BedAvailability";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hospital Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's a summary of your hospital's status.</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Appointments */}
          <AppointmentsList />

          {/* Bed Availability */}
          <BedAvailability />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
