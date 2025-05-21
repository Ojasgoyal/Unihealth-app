
import { format } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "@/services/appointmentsService";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

interface AppointmentsTableProps {
  appointments: Appointment[];
  onUpdateStatus: (appointment: Appointment) => void;
}

// Format patient name
const formatPatientName = (appointment: Appointment) => {
  if (appointment.patient && appointment.patient.first_name) {
    return `${appointment.patient.first_name} ${appointment.patient.last_name || ''}`;
  }
  return `Patient ${appointment.patient_id.substring(0, 8)}`;
};

const AppointmentsTable = ({ appointments, onUpdateStatus }: AppointmentsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.start_time} - {appointment.end_time}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {formatPatientName(appointment)}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  {appointment.doctor?.name || "Unknown"}
                  <p className="text-xs text-muted-foreground">
                    {appointment.doctor?.specialization}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate">
                  {appointment.reason || "No reason provided"}
                </div>
              </TableCell>
              <TableCell>
                <AppointmentStatusBadge status={appointment.status} />
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus(appointment)}
                >
                  Update Status
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentsTable;
