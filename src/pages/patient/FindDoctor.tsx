
import { useState } from "react";
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

// Mock doctor data
const allDoctors = [
  {
    id: 1,
    name: "Dr. Michael Stevens",
    specialization: "Cardiology",
    hospital: "Central Hospital",
    location: "Downtown, New York",
    rating: 4.8,
    reviews: 124,
    experience: 15,
    education: "Harvard Medical School",
    nextAvailable: "Today",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZG9jdG9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    name: "Dr. Emily Chen",
    specialization: "Pediatrics",
    hospital: "Children's Medical Center",
    location: "Westside, Chicago",
    rating: 4.9,
    reviews: 215,
    experience: 12,
    education: "Johns Hopkins University",
    nextAvailable: "Tomorrow",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    hospital: "University Hospital",
    location: "Midtown, Los Angeles",
    rating: 4.7,
    reviews: 98,
    experience: 20,
    education: "Stanford University",
    nextAvailable: "May 15, 2025",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    name: "Dr. Lisa Thompson",
    specialization: "Neurology",
    hospital: "Central Hospital",
    location: "Downtown, New York",
    rating: 4.8,
    reviews: 156,
    experience: 18,
    education: "Yale School of Medicine",
    nextAvailable: "May 14, 2025",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    name: "Dr. Robert Miller",
    specialization: "Dermatology",
    hospital: "Skin & Beauty Clinic",
    location: "Uptown, San Francisco",
    rating: 4.6,
    reviews: 89,
    experience: 10,
    education: "Columbia University",
    nextAvailable: "May 16, 2025",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGRvY3RvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    hospital: "Heart Institute",
    location: "Eastside, Boston",
    rating: 4.9,
    reviews: 201,
    experience: 22,
    education: "Mayo Medical School",
    nextAvailable: "Today",
    image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZG9jdG9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
];

// Specialization options for filter
const specializations = [
  { value: "all", label: "All Specializations" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Pediatrics", label: "Pediatrics" },
];

// Locations for filter
const locations = [
  { value: "all", label: "All Locations" },
  { value: "New York", label: "New York" },
  { value: "Chicago", label: "Chicago" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Boston", label: "Boston" },
  { value: "San Francisco", label: "San Francisco" },
];

const FindDoctor = () => {
  const { toast } = useToast();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [location, setLocation] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState("all"); // "all", "today", "this-week"
  
  // Filter doctors based on criteria
  const filteredDoctors = allDoctors.filter(doctor => {
    // Search query filter
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Specialization filter
    const matchesSpecialization = specialization === "all" || doctor.specialization === specialization;
    
    // Location filter
    const matchesLocation = location === "all" || doctor.location.includes(location);
    
    // Rating filter
    const matchesRating = doctor.rating >= minRating;
    
    // Availability filter
    let matchesAvailability = true;
    if (availability === "today") {
      matchesAvailability = doctor.nextAvailable === "Today";
    } else if (availability === "this-week") {
      matchesAvailability = doctor.nextAvailable === "Today" || 
                           doctor.nextAvailable === "Tomorrow" ||
                           new Date(doctor.nextAvailable) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
    
    return matchesSearch && matchesSpecialization && matchesLocation && matchesRating && matchesAvailability;
  });

  const handleBookAppointment = (doctorId: number) => {
    // Navigate to appointment booking with selected doctor
    toast({
      title: "Booking Initiated",
      description: "Redirecting to appointment booking page...",
    });
  };

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
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-3 block">
                Minimum Rating: {minRating === 0 ? "Any" : minRating.toFixed(1)}
              </label>
              <Slider
                defaultValue={[0]}
                max={5}
                step={0.5}
                value={[minRating]}
                onValueChange={(values) => setMinRating(values[0])}
                className="max-w-md"
              />
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{filteredDoctors.length} doctors found</h2>
            <Select defaultValue="rating">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="availability">Earliest Available</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredDoctors.length > 0 ? (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden card-hover">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-48 md:h-auto">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="p-4 md:p-6 flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{doctor.name}</h3>
                            <p className="text-healthcare-primary">{doctor.specialization}</p>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                              <span className="text-sm text-gray-500">{doctor.hospital}, {doctor.location}</span>
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 md:text-right">
                            <div className="flex items-center md:justify-end">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="font-semibold">{doctor.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({doctor.reviews} reviews)</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              {doctor.experience} years experience
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">{doctor.education}</Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Clock className="h-3 w-3 mr-1" /> 
                            Next Available: {doctor.nextAvailable}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          <Button 
                            onClick={() => handleBookAppointment(doctor.id)}
                            className="bg-healthcare-primary hover:bg-healthcare-secondary"
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
