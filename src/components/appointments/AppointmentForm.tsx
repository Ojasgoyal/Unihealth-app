
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "@/services/appointmentsService";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Doctor } from "@/services/doctorsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardFooter } from "@/components/ui/card";
import DoctorSelector from "./DoctorSelector";
import DateSelector from "./DateSelector";
import TimeSlotSelector, { calculateEndTime } from "./TimeSlotSelector";

interface AppointmentFormProps {
  initialDoctor?: Doctor | null;
  patientId?: string | null;
}

const AppointmentForm = ({ initialDoctor = null, patientId = null }: AppointmentFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State for form
  const [doctor, setDoctor] = useState<Doctor | null>(initialDoctor);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

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
    onError: (error: Error) => {
      console.error("Appointment creation error:", error);
      toast({
        title: "Error Booking Appointment",
        description: error.message || "There was a problem booking your appointment.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctor || !date || !startTime || !patientId) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields or login to continue.",
        variant: "destructive",
      });
      return;
    }
    
    const endTime = calculateEndTime(startTime);
    const formattedDate = format(date, "yyyy-MM-dd");
    
    createAppointmentMutation.mutate({
      doctor_id: doctor.id,
      patient_id: patientId,
      appointment_date: formattedDate,
      start_time: startTime,
      end_time: endTime,
      reason,
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DoctorSelector 
        selectedDoctor={doctor} 
        onDoctorChange={setDoctor} 
        isDisabled={!!initialDoctor}
      />
      
      <DateSelector selectedDate={date} onDateChange={setDate} />
      
      <TimeSlotSelector selectedTime={startTime} onTimeChange={setStartTime} />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Reason for Visit</label>
        <Input
          placeholder="Briefly describe your reason for visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Notes (Optional)</label>
        <Textarea
          placeholder="Any additional information the doctor should know"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <CardFooter className="flex justify-between px-0">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-healthcare-primary"
          disabled={!doctor || !date || !startTime || !patientId || createAppointmentMutation.isPending}
        >
          {createAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default AppointmentForm;
