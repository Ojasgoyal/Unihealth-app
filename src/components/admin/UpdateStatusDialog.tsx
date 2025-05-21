
import { format } from "date-fns";
import { AlertCircle, UserCheck, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/services/appointmentsService";

interface UpdateStatusDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}

const UpdateStatusDialog = ({ 
  appointment, 
  isOpen, 
  onClose, 
  onStatusChange 
}: UpdateStatusDialogProps) => {
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Appointment Status</DialogTitle>
          <DialogDescription>
            Change the status for this appointment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-md p-3 bg-muted/30">
            <p><strong>Date:</strong> {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</p>
            <p><strong>Time:</strong> {appointment.start_time} - {appointment.end_time}</p>
            <p><strong>Doctor:</strong> {appointment.doctor?.name}</p>
            <p><strong>Current Status:</strong> {appointment.status}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">New Status:</label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={appointment.status === "pending" ? "default" : "outline"}
                onClick={() => onStatusChange("pending")}
                className="w-full justify-start"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Pending
              </Button>
              <Button 
                variant={appointment.status === "confirmed" ? "default" : "outline"}
                onClick={() => onStatusChange("confirmed")}
                className="w-full justify-start"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Confirmed
              </Button>
              <Button 
                variant={appointment.status === "completed" ? "default" : "outline"}
                onClick={() => onStatusChange("completed")}
                className="w-full justify-start"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </Button>
              <Button 
                variant={appointment.status === "cancelled" ? "destructive" : "outline"}
                onClick={() => onStatusChange("cancelled")}
                className={`w-full justify-start ${appointment.status === "cancelled" ? "" : "text-destructive"}`}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelled
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;
