
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "@/services/doctorsService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, MapPin, Search } from "lucide-react";

const FindDoctor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });

  // Filter doctors based on search and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchQuery === "" || doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  // Gets unique specializations from all doctors
  const specializations = ["all", ...Array.from(new Set(doctors.map(doctor => doctor.specialization)))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(tempSearchQuery);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecializationFilter(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <DashboardLayout userRole="patient">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Find a Doctor</h1>
        <p className="text-muted-foreground mb-6">Search for specialists that match your needs</p>
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search doctors by name..."
              value={tempSearchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="max-w-md"
            />
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          <Select value={specializationFilter} onValueChange={handleSpecializationChange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((specialization) => (
                <SelectItem key={specialization} value={specialization}>
                  {specialization === "all" ? "All Specializations" : specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-primary"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <ScrollArea className="h-[600px] w-full rounded-md border">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Search className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No doctors found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter to find available doctors.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const DoctorCard = ({ doctor }) => {
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} alt={doctor.name} />
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{doctor.name}</CardTitle>
            <CardDescription>{doctor.specialization}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>Central Hospital</span>
        </div>
        <div className="flex items-center text-gray-500 mb-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Available: {doctor.available ? "Yes" : "No"}</span>
        </div>
        <BookAppointmentButton doctor={doctor} />
      </CardContent>
    </Card>
  );
};

const BookAppointmentButton = ({ doctor }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`/patient/appointments/new?doctor=${doctor.id}`);
    toast({
      title: "Doctor selected",
      description: `You've selected ${doctor.name} for an appointment.`,
      duration: 3000,
    });
  };

  return (
    <Button 
      onClick={handleBookAppointment} 
      className="w-full"
      disabled={!doctor.available}
    >
      {doctor.available ? "Book Appointment" : "Currently Unavailable"}
    </Button>
  );
};

export default FindDoctor;
