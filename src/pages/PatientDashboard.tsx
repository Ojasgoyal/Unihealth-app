
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, FileText, Search, ArrowRight, MapPin } from "lucide-react";

const PatientDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "May 15, 2025",
      time: "10:30 AM",
      location: "Central Hospital, Room 305"
    },
    {
      doctorName: "Dr. Michael Stevens",
      specialty: "Dermatologist",
      date: "May 22, 2025",
      time: "2:15 PM",
      location: "Medical Center, Room 210"
    }
  ];

  // Mock recent prescriptions
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

  // Mock recommended doctors
  const recommendedDoctors = [
    {
      name: "Dr. Emily Chen",
      specialty: "Pediatrician",
      hospital: "Children's Medical Center",
      rating: 4.9,
      availability: "Available today"
    },
    {
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      hospital: "University Hospital",
      rating: 4.7,
      availability: "Next available: May 17"
    },
    {
      name: "Dr. Lisa Thompson",
      specialty: "Neurologist",
      hospital: "Central Hospital",
      rating: 4.8,
      availability: "Next available: May 14"
    }
  ];

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, John</h1>
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
                onClick={() => navigate("/patient/appointments/new")}
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
          <Card className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled doctor visits</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-healthcare-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-6">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{appointment.date}</p>
                          <p className="text-xs text-gray-500">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No upcoming appointments</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => navigate("/patient/appointments/new")}
                  >
                    Schedule one now
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate("/patient/appointments")}
              >
                View All Appointments
              </Button>
            </CardFooter>
          </Card>

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
            <CardDescription>Based on your medical history and location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {recommendedDoctors.map((doctor, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  <p className="text-xs text-gray-500 mt-1">{doctor.hospital}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-6.918 3.636 1.32-7.7L.34 7.494l7.712-1.121L10 0l1.948 6.373 7.712 1.121-5.062 4.027 1.32 7.7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm">{doctor.rating}</span>
                  </div>
                  <p className="text-xs mt-2 text-healthcare-primary">{doctor.availability}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => navigate("/patient/find-doctor")}
                  >
                    View Profile <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
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
