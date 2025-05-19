
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "@/services/appointmentsService";
import { getDoctors, Doctor } from "@/services/doctorsService";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock time slots for demonstration
const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", 
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM"
];

const calculateEndTime = (startTime: string): string => {
  // Simple function to add 30 minutes to the start time
  const [time, period] = startTime.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  
  let newHours = hours;
  let newMinutes = minutes + 30;
  let newPeriod = period;
  
  if (newMinutes >= 60) {
    newHours += 1;
    newMinutes -= 60;
  }
  
  if (newHours === 12 && period === "AM") {
    newPeriod = "PM";
  } else if (newHours > 12) {
    newHours -= 12;
  }
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
};

const NewAppointment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const selectedDoctor = location.state?.selectedDoctor;
  
  // State for form
  const [doctor, setDoctor] = useState<Doctor | null>(selectedDoctor || null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Fetch doctors
  const { data: doctors = [] } = useQuery({
    queryKey: ['appointmentDoctors'],
    queryFn: getDoctors
  });

  // Filter doctors to show only available ones
  const availableDoctors = doctors.filter(doc => doc.available);

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      toast({
        title: "Appointment Booked Successfully",
        description: "You will receive a confirmation shortly.",
      });
      navigate("/patient/appointments");
    },
    onError: (error) => {
      toast({
        title: "Error Booking Appointment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctor || !date || !startTime) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const endTime = calculateEndTime(startTime);
    const formattedDate = format(date, "yyyy-MM-dd");
    
    // Hardcoded patient ID for demo - in a real app, this would come from authentication context
    const patientId = "123e4567-e89b-12d3-a456-426614174000";
    
    createAppointmentMutation.mutate({
      doctor_id: doctor.id,
      patient_id: patientId,
      appointment_date: formattedDate,
      start_time: startTime,
      end_time: endTime,
      reason: reason || null,
      notes: notes || null
    });
  };

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">Fill in the details to schedule your appointment</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Select your doctor, preferred date and time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Doctor Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Doctor</label>
                <Select
                  value={doctor?.id}
                  onValueChange={(doctorId) => {
                    const selected = doctors.find(d => d.id === doctorId);
                    setDoctor(selected || null);
                  }}
                  disabled={!!selectedDoctor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDoctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {doctor && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <h4 className="font-medium">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <p className="text-xs text-gray-500 mt-1">Schedule: {doctor.schedule}</p>
                  </div>
                )}
              </div>
              
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => {
                        // Disable past dates
                        return date < new Date(Date.now() - (24 * 60 * 60 * 1000));
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Time Slot Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Time</label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {startTime && (
                  <p className="text-xs text-gray-500 mt-1">
                    Duration: 30 minutes ({startTime} - {calculateEndTime(startTime)})
                  </p>
                )}
              </div>
              
              {/* Reason for Visit */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Visit</label>
                <Input
                  placeholder="Briefly describe your reason for visit"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              
              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes (Optional)</label>
                <Textarea
                  placeholder="Any additional information the doctor should know"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-healthcare-primary"
                disabled={!doctor || !date || !startTime || createAppointmentMutation.isPending}
              >
                {createAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewAppointment;
