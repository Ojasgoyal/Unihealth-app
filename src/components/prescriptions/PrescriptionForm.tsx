
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { Prescription, CreatePrescriptionData } from "@/services/prescriptionsService";

// Create a schema for prescription form validation
const prescriptionSchema = z.object({
  appointment_id: z.string().min(1, "Appointment is required"),
  doctor_id: z.string().min(1, "Doctor is required"),
  patient_id: z.string().min(1, "Patient is required"),
  medications: z.string().min(1, "Medications are required"),
  dosage: z.string().min(1, "Dosage is required"),
  instructions: z.string().min(1, "Instructions are required"),
  issue_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().optional(),
  status: z.string().min(1, "Status is required")
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PrescriptionFormProps {
  onSubmit: (data: PrescriptionFormValues) => Promise<void>;
  editingPrescription: Prescription | null;
  onCancel: () => void;
  appointments: any[];
  doctors: any[];
}

export const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  onSubmit,
  editingPrescription,
  onCancel,
  appointments,
  doctors
}) => {
  // Create prescription form
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      appointment_id: editingPrescription?.appointment_id || "",
      doctor_id: editingPrescription?.doctor_id || "",
      patient_id: editingPrescription?.patient_id || "",
      medications: editingPrescription 
        ? Array.isArray(editingPrescription.medications) 
          ? editingPrescription.medications.join(", ") 
          : String(editingPrescription.medications)
        : "",
      dosage: editingPrescription?.dosage || "",
      instructions: editingPrescription?.instructions || "",
      issue_date: editingPrescription 
        ? editingPrescription.issue_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
      expiry_date: editingPrescription?.expiry_date 
        ? editingPrescription.expiry_date.split('T')[0]
        : "",
      status: editingPrescription?.status || "active"
    }
  });

  // Update appointment selection with patient and doctor
  const handleAppointmentSelect = (appointmentId: string) => {
    const selectedAppointment = appointments.find(a => a.id === appointmentId);
    if (selectedAppointment) {
      form.setValue("doctor_id", selectedAppointment.doctor_id);
      form.setValue("patient_id", selectedAppointment.patient_id);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="appointment_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleAppointmentSelect(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <SelectItem key={appointment.id} value={appointment.id}>
                        {format(new Date(appointment.appointment_date), 'PP')}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-appointments">No appointments available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="doctor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.length > 0 ? (
                      doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name || "Doctor " + doctor.id.substring(0, 4)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-doctors">No doctors available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="medications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medications (comma separated)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dosage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dosage</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="issue_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expiry_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{editingPrescription ? "Update" : "Create"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PrescriptionForm;
