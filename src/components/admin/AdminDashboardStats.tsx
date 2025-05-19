
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, ClipboardList, Bed } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  loading: boolean;
}

const StatsCard = ({ title, value, description, icon, loading }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {loading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
        ) : (
          value
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    </CardContent>
  </Card>
);

export const AdminDashboardStats = () => {
  // Fetch total doctors count
  const { data: doctorsCount, isLoading: loadingDoctors } = useQuery({
    queryKey: ["admin-stats-doctors"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch total appointments count
  const { data: appointmentsCount, isLoading: loadingAppointments } = useQuery({
    queryKey: ["admin-stats-appointments"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch today's appointments count
  const { data: todayAppointments, isLoading: loadingTodayAppointments } = useQuery({
    queryKey: ["admin-stats-today-appointments"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('appointment_date', today);
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch active prescriptions count
  const { data: prescriptionsCount, isLoading: loadingPrescriptions } = useQuery({
    queryKey: ["admin-stats-prescriptions"],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('prescriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching prescriptions count:', error);
        return 0;
      }
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Doctors"
        value={doctorsCount || 0}
        description="Active healthcare providers"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        loading={loadingDoctors}
      />
      
      <StatsCard
        title="Total Appointments"
        value={appointmentsCount || 0}
        description="All scheduled appointments"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        loading={loadingAppointments}
      />
      
      <StatsCard
        title="Today's Appointments"
        value={todayAppointments || 0}
        description="Appointments scheduled for today"
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        loading={loadingTodayAppointments}
      />
      
      <StatsCard
        title="Active Prescriptions"
        value={prescriptionsCount || 0}
        description="Currently active prescriptions"
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        loading={loadingPrescriptions}
      />
    </div>
  );
};
