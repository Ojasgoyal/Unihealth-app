
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Date</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            initialFocus
            disabled={(date) => {
              // Disable past dates
              return date < new Date(Date.now() - (24 * 60 * 60 * 1000));
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
