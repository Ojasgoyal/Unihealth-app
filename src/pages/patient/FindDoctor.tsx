
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Stethoscope, Map, Calendar, Search, UserX } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  schedule: string;
  available: boolean;
}

const FindDoctor = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availability, setAvailability] = useState("");

  // Fetch all doctors
  const { data: allDoctors = [], isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  // Filter doctors based on search term, specialization, and availability
  const filteredDoctors = allDoctors.filter(doctor => {
    const matchesSearch = searchQuery === "" || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialization = specialization === "" || 
      doctor.specialization.toLowerCase() === specialization.toLowerCase();
    
    const matchesAvailability = availability === "" || 
      (availability === "available" && doctor.available) ||
      (availability === "unavailable" && !doctor.available);
    
    return matchesSearch && matchesSpecialization && matchesAvailability;
  });

  // Get unique specializations for the filter dropdown
  const specializations = [...new Set(allDoctors.map(doctor => doctor.specialization))];

  if (error) {
    toast({
      title: "Error loading doctors",
      description: "There was a problem loading the doctor list.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Find a Doctor</h1>
          <p className="text-muted-foreground">
            Search for healthcare providers by name, specialization, or availability
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} className="shrink-0">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          
          <Select value={specialization} onValueChange={setSpecialization}>
            <SelectTrigger>
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger>
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-primary"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{doctor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        <Stethoscope className="inline h-4 w-4 mr-1" />
                        {doctor.specialization}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      doctor.available 
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {doctor.available ? "Available" : "Unavailable"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <p className="text-sm">
                      <Map className="inline h-4 w-4 mr-1" /> 
                      Contact: {doctor.phone}
                    </p>
                    <p className="text-sm">
                      <Calendar className="inline h-4 w-4 mr-1" /> 
                      Schedule: {doctor.schedule}
                    </p>
                    <Button className="w-full mt-4" variant="outline">
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <UserX className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No doctors found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindDoctor;
