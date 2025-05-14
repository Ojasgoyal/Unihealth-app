
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { PatientAppointments } from "@/components/appointments/PatientAppointments";
import { Calendar, Clock, FileText, Search, ArrowRight, MapPin } from "lucide-react";
import { getDoctors, Doctor } from "@/services/doctorsService";

const PatientDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Fetch recommended doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data.filter(d => d.available).slice(0, 3));
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Mock recent prescriptions for now
  const recentPrescriptions = [
    {
      doctorName: "Dr. Sarah Johnson",
      date: "April 30, 2025",
      medications: ["Atenolol 50mg", "Aspirin 81mg"],
      instructions: "Take once daily with food",
      status: "Active"
    },
    {
      doctorName: "Dr. Robert Miller",
      date: "April 15, 2025",
      medications: ["Amoxicillin 500mg"],
      instructions: "Take three times daily for 10 days",
      status: "Completed"
    }
  ];

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {profile?.first_name || "Patient"}
          </h1>
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
                onClick={() => navigate("/patient/appointments")}
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
          <PatientAppointments limit={2} />

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
              {recentPrescriptions.length > 0 ? (
                <div className="space-y-6">
                  {recentPrescriptions.map((prescription, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{prescription.doctorName}</p>
                          <p className="text-sm text-gray-500">{prescription.date}</p>
                        </div>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${
                            prescription.status === "Active" 
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
            <CardDescription>Available specialists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  <p className="text-xs text-gray-500 mt-1">Schedule: {doctor.schedule}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => navigate("/patient/appointments")}
                  >
                    Book Appointment <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
              {doctors.length === 0 && (
                <div className="col-span-3 text-center py-4">
                  <p className="text-gray-500">Loading doctor recommendations...</p>
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
