
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Bed, FilePlus, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Mock data for stats
  const stats = [
    {
      title: "Total Doctors",
      value: "24",
      description: "Active medical staff",
      icon: <Users className="h-5 w-5 text-healthcare-primary" />,
      change: "+2 this month"
    },
    {
      title: "Total Beds",
      value: "150",
      description: "Hospital capacity",
      icon: <Bed className="h-5 w-5 text-healthcare-primary" />,
      change: "90% occupancy"
    },
    {
      title: "Today's Appointments",
      value: "37",
      description: "Scheduled for today",
      icon: <Calendar className="h-5 w-5 text-healthcare-primary" />,
      change: "5 pending approval"
    },
    {
      title: "New Prescriptions",
      value: "12",
      description: "Created today",
      icon: <FilePlus className="h-5 w-5 text-healthcare-primary" />,
      change: "+4 since yesterday"
    }
  ];

  // Mock data for appointments
  const recentAppointments = [
    {
      patientName: "Sarah Johnson",
      doctorName: "Dr. Michael Stevens",
      specialty: "Cardiology",
      time: "09:30 AM",
      status: "Confirmed"
    },
    {
      patientName: "Robert Williams",
      doctorName: "Dr. Emily Chen",
      specialty: "Pediatrics",
      time: "10:15 AM",
      status: "Pending"
    },
    {
      patientName: "Jennifer Davis",
      doctorName: "Dr. James Wilson",
      specialty: "Orthopedics",
      time: "11:00 AM",
      status: "Confirmed"
    },
    {
      patientName: "David Brown",
      doctorName: "Dr. Lisa Thompson",
      specialty: "Neurology",
      time: "01:45 PM",
      status: "Confirmed"
    },
    {
      patientName: "Michael Garcia",
      doctorName: "Dr. Robert Miller",
      specialty: "Dermatology",
      time: "03:30 PM",
      status: "Pending"
    }
  ];

  // Mock data for bed availability
  const bedAvailability = [
    { ward: "General Ward", total: 80, occupied: 68, available: 12 },
    { ward: "ICU", total: 20, occupied: 15, available: 5 },
    { ward: "Pediatric", total: 30, occupied: 22, available: 8 },
    { ward: "Maternity", total: 20, occupied: 12, available: 8 }
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hospital Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's a summary of your hospital's status.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-healthcare-primary mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Appointments */}
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
              <div className="space-y-6">
                {recentAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{appointment.patientName}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{appointment.doctorName}</span>
                        <span className="mx-1">•</span>
                        <span>{appointment.specialty}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p>{appointment.time}</p>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === "Confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bed Availability */}
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bed Availability</CardTitle>
                  <CardDescription>Current hospital capacity</CardDescription>
                </div>
                <Bed className="h-5 w-5 text-healthcare-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bedAvailability.map((ward, index) => {
                  const occupancyRate = Math.round((ward.occupied / ward.total) * 100);
                  let progressColor = "bg-healthcare-primary";
                  
                  if (occupancyRate > 90) {
                    progressColor = "bg-red-500";
                  } else if (occupancyRate > 75) {
                    progressColor = "bg-yellow-500";
                  } else if (occupancyRate > 50) {
                    progressColor = "bg-green-500";
                  }
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <p className="font-medium">{ward.ward}</p>
                        <p className="text-sm">
                          <span className="font-semibold">{ward.available}</span> available / {ward.total} total
                        </p>
                      </div>
                      <Progress 
                        value={occupancyRate} 
                        className="h-2"
                        indicatorClassName={progressColor}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
