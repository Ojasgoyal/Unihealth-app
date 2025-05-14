
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Doctor } from "@/services/doctorsService";
import { getAppointmentsForDate } from "@/services/appointmentsService";
import { useToast } from "@/components/ui/use-toast";

// Time slots
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00"
];

// Duration in minutes
const APPOINTMENT_DURATION = 30;

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctors: Doctor[];
  onSubmit: (appointment: {
    doctorId: string;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
  }) => void;
}

export const AppointmentForm = ({ 
  open, 
  onOpenChange, 
  doctors, 
  onSubmit 
}: AppointmentFormProps) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [doctorId, setDoctorId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [reason, setReason] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Update available time slots when doctor or date changes
  useEffect(() => {
    async function fetchAvailableSlots() {
      if (!doctorId || !date) {
        setAvailableTimeSlots([]);
        return;
      }

      setIsLoadingSlots(true);
      try {
        const selectedDate = format(date, "yyyy-MM-dd");
        const appointments = await getAppointmentsForDate(doctorId, selectedDate);
        
        // Filter out booked slots
        const bookedSlots = new Set(appointments.map(app => app.start_time.slice(0, 5)));
        const availableSlots = TIME_SLOTS.filter(slot => !bookedSlots.has(slot));
        
        setAvailableTimeSlots(availableSlots);
      } catch (error) {
        console.error("Error fetching appointment slots:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available appointment slots",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSlots(false);
      }
    }
    
    fetchAvailableSlots();
  }, [doctorId, date, toast]);

  const handleSubmit = () => {
    if (!doctorId || !date || !startTime || !reason) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Calculate end time (30 minutes after start time)
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + APPOINTMENT_DURATION);
    
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    onSubmit({
      doctorId,
      date: format(date, "yyyy-MM-dd"),
      startTime,
      endTime,
      reason
    });

    // Reset form
    setDate(undefined);
    setDoctorId("");
    setStartTime("");
    setReason("");
  };

  const handleClose = () => {
    // Reset form on close
    setDate(undefined);
    setDoctorId("");
    setStartTime("");
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Fill in the details to schedule an appointment with one of our specialists.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="doctor">Select Doctor</Label>
            <Select
              value={doctorId}
              onValueChange={setDoctorId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors
                  .filter(doctor => doctor.available)
                  .map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                // Disable past dates and weekends
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                const day = date.getDay();
                return date < now || day === 0 || day === 6;
              }}
              className="border rounded-md p-2"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="time">Select Time</Label>
            <Select
              value={startTime}
              onValueChange={setStartTime}
              disabled={!date || !doctorId || isLoadingSlots}
            >
              <SelectTrigger>
                {isLoadingSlots ? (
                  <SelectValue placeholder="Loading available slots..." />
                ) : (
                  <SelectValue placeholder="Select a time slot" />
                )}
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    No available slots
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the appointment"
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!doctorId || !date || !startTime || !reason || isLoadingSlots}
          >
            Book Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
