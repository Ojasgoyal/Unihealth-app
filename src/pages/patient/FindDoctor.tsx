
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Calendar, Clock, Search, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDoctors, Doctor } from "@/services/doctorsService";

// Specialization options for filter
const specializations = [
  { value: "all", label: "All Specializations" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  { value: "Oncology", label: "Oncology" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "Pulmonology", label: "Pulmonology" },
  { value: "Radiology", label: "Radiology" },
  { value: "Urology", label: "Urology" },
];

// Locations for filter (we'll extract these dynamically in a real app)
const locations = [
  { value: "all", label: "All Locations" },
  { value: "New York", label: "New York" },
  { value: "Chicago", label: "Chicago" },
  { value: "Los Angeles", label: "Los Angeles" },
];

const FindDoctor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [location, setLocation] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState("all"); // "all", "today", "this-week"
  
  // Fetch doctors from database
  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ['findDoctors'],
    queryFn: getDoctors
  });
  
  // Filter doctors based on criteria
  const filteredDoctors = doctors.filter(doctor => {
    // Search query filter
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Specialization filter
    const matchesSpecialization = specialization === "all" || doctor.specialization === specialization;
    
    // Availability filter
    const matchesAvailability = availability === "all" || doctor.available;
    
    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    // Navigate to appointment booking with selected doctor
    navigate("/patient/appointments/new", { state: { selectedDoctor: doctor } });
    
    toast({
      title: "Doctor Selected",
      description: `You've selected ${doctor.name}. Complete your appointment details.`,
    });
  };

  if (error) {
    toast({
      title: "Error loading doctors",
      description: "There was a problem loading the doctors list.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Find a Doctor</h1>
          <p className="text-muted-foreground">
            Search for doctors by specialization, location, or availability
          </p>
        </div>
        
        {/* Search and Filters Section */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by doctor name, specialization, or hospital..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Specialization</label>
                <Select
                  value={specialization}
                  onValueChange={setSpecialization}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec.value} value={spec.value}>
                        {spec.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Select
                  value={location}
                  onValueChange={setLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Availability</label>
                <Select
                  value={availability}
                  onValueChange={setAvailability}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any time</SelectItem>
                    <SelectItem value="available">Currently Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {isLoading ? "Loading doctors..." : `${filteredDoctors.length} doctors found`}
            </h2>
            <Select defaultValue="name">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="specialization">Specialization</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-primary"></div>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden card-hover">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-48 md:h-auto bg-gray-100 flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-24 h-24 rounded-full bg-healthcare-primary/20 flex items-center justify-center text-healthcare-primary">
                            <span className="text-3xl font-bold">{doctor.name.charAt(0)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{doctor.name}</h3>
                            <p className="text-healthcare-primary">{doctor.specialization}</p>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-500">Central Hospital</span>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 md:text-right">
                            <div className="flex items-center md:justify-end">
                              <Badge 
                                variant={doctor.available ? "success" : "destructive"} 
                                className={doctor.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {doctor.available ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {doctor.email}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">{doctor.specialization}</Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Clock className="h-3 w-3 mr-1" /> 
                            Schedule: {doctor.schedule}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <Button 
                            onClick={() => handleBookAppointment(doctor)}
                            className="bg-healthcare-primary hover:bg-healthcare-secondary"
                            disabled={!doctor.available}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Book Appointment
                          </Button>
                          <Button variant="outline">View Profile</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Search className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No doctors found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindDoctor;
