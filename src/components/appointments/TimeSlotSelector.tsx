
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

interface TimeSlotSelectorProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
}

export const calculateEndTime = (startTime: string): string => {
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

const TimeSlotSelector = ({ selectedTime, onTimeChange }: TimeSlotSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Time</label>
      <Select value={selectedTime} onValueChange={onTimeChange}>
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
      {selectedTime && (
        <p className="text-xs text-gray-500 mt-1">
          Duration: 30 minutes ({selectedTime} - {calculateEndTime(selectedTime)})
        </p>
      )}
    </div>
  );
};

export default TimeSlotSelector;
