
import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

export const AppointmentsList = () => {
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
  );
};
