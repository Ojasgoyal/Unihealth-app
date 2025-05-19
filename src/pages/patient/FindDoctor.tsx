
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, MapPin } from "lucide-react";

const FindDoctor = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fix: Remove the unnecessary arguments to getDoctors
  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ["doctors", searchQuery, specializationFilter],
    queryFn: () => getDoctors(),
  });

  // Filter doctors based on search and specialization
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecializationFilter(value);
  };

  if (isLoading) return <div>Loading doctors...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search doctors..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-md"
        />
        <Select value={specializationFilter} onValueChange={handleSpecializationChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            <SelectItem value="Cardiologist">Cardiologist</SelectItem>
            <SelectItem value="Dermatologist">Dermatologist</SelectItem>
            <SelectItem value="Endocrinologist">Endocrinologist</SelectItem>
            <SelectItem value="Gastroenterologist">Gastroenterologist</SelectItem>
            <SelectItem value="Neurologist">Neurologist</SelectItem>
            <SelectItem value="Oncologist">Oncologist</SelectItem>
            <SelectItem value="Ophthalmologist">Ophthalmologist</SelectItem>
            <SelectItem value="Orthopedist">Orthopedist</SelectItem>
            <SelectItem value="Pediatrician">Pediatrician</SelectItem>
            <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
            <SelectItem value="Pulmonologist">Pulmonologist</SelectItem>
            <SelectItem value="Radiologist">Radiologist</SelectItem>
            <SelectItem value="Rheumatologist">Rheumatologist</SelectItem>
            <SelectItem value="Urologist">Urologist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[600px] w-full rounded-md border">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

const DoctorCard = ({ doctor }) => {
  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader>
        <div className="flex items-center">
          <Avatar className="mr-4">
            <AvatarImage src="https://github.com/shadcn.png" alt={doctor.name} />
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
    <Button onClick={handleBookAppointment} className="w-full">
      Book Appointment
    </Button>
  );
};

export default FindDoctor;
