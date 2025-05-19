
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Edit, Calendar, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Prescription, 
  getAllPrescriptions, 
  createPrescription,
  updatePrescriptionStatus
} from "@/services/prescriptionsService";

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

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

const PrescriptionsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  // Fetch all prescriptions
  const { data: prescriptions = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-prescriptions"],
    queryFn: getAllPrescriptions
  });

  // Fetch appointments for form
  const { data: appointments = [] } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, doctor_id, patient_id, appointment_date')
        .order('appointment_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch doctors for form
  const { data: doctors = [] } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Filter prescriptions based on the selected tab
  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (activeTab === "all") return true;
    return prescription.status?.toLowerCase() === activeTab;
  });

  // Create prescription form
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      appointment_id: "",
      doctor_id: "",
      patient_id: "",
      medications: "",
      dosage: "",
      instructions: "",
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: "",
      status: "active"
    }
  });

  // Handle form submission
  const onSubmit = async (values: PrescriptionFormValues) => {
    try {
      const prescriptionData = {
        ...values,
        medications: values.medications.split(',').map(med => med.trim()),
        issue_date: new Date(values.issue_date).toISOString()
      };

      if (values.expiry_date) {
        prescriptionData.expiry_date = new Date(values.expiry_date).toISOString();
      }

      let result;
      
      if (editingPrescription) {
        // Update existing prescription
        const { data, error } = await supabase
          .from('prescriptions')
          .update(prescriptionData)
          .eq('id', editingPrescription.id)
          .select();
        
        if (error) throw error;
        result = data;
        toast({
          title: "Prescription updated",
          description: "The prescription has been updated successfully."
        });
      } else {
        // Create new prescription using our service
        await createPrescription(prescriptionData);
        toast({
          title: "Prescription created",
          description: "The prescription has been created successfully."
        });
      }
      
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-prescriptions"] });
      
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save prescription. Please try again."
      });
    }
  };

  // Handle prescription status update
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updatePrescriptionStatus(id, status);
      
      toast({
        title: "Status updated",
        description: `Prescription status updated to ${status}.`
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-prescriptions"] });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status. Please try again."
      });
    }
  };

  // Open edit dialog with prescription data
  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    
    form.reset({
      appointment_id: prescription.appointment_id,
      doctor_id: prescription.doctor_id,
      patient_id: prescription.patient_id,
      medications: Array.isArray(prescription.medications) 
        ? prescription.medications.join(", ") 
        : prescription.medications.toString(),
      dosage: prescription.dosage,
      instructions: prescription.instructions,
      issue_date: prescription.issue_date.split('T')[0],
      expiry_date: prescription.expiry_date ? prescription.expiry_date.split('T')[0] : undefined,
      status: prescription.status || "active"
    });
    
    setIsDialogOpen(true);
  };

  // Open dialog for new prescription
  const handleAddNew = () => {
    setEditingPrescription(null);
    form.reset({
      appointment_id: "",
      doctor_id: "",
      patient_id: "",
      medications: "",
      dosage: "",
      instructions: "",
      issue_date: new Date().toISOString().split('T')[0],
      expiry_date: "",
      status: "active"
    });
    setIsDialogOpen(true);
  };

  // Update appointment selection with patient and doctor
  const handleAppointmentSelect = (appointmentId: string) => {
    const selectedAppointment = appointments.find(a => a.id === appointmentId);
    if (selectedAppointment) {
      form.setValue("doctor_id", selectedAppointment.doctor_id);
      form.setValue("patient_id", selectedAppointment.patient_id);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Prescriptions Management</h1>
            <p className="text-muted-foreground">Manage all patient prescriptions</p>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Prescription
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-primary"></div>
              </div>
            ) : filteredPrescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-mono text-xs">{prescription.id.substring(0, 8)}...</TableCell>
                        <TableCell>{prescription.patient_id.substring(0, 8)}...</TableCell>
                        <TableCell>
                          {prescription.doctor?.name || "Unknown"}
                          <p className="text-xs text-muted-foreground">{prescription.doctor?.specialization}</p>
                        </TableCell>
                        <TableCell>
                          <ul className="text-sm">
                            {Array.isArray(prescription.medications) ? (
                              prescription.medications.map((med, i) => <li key={i}>{med}</li>)
                            ) : (
                              <li>{String(prescription.medications)}</li>
                            )}
                          </ul>
                        </TableCell>
                        <TableCell>
                          {prescription.issue_date ? format(new Date(prescription.issue_date), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
                            prescription.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : prescription.status === 'completed' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {prescription.status || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(prescription)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Select 
                              defaultValue={prescription.status} 
                              onValueChange={(value) => handleStatusUpdate(prescription.id, value)}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No prescriptions found</h3>
                <p className="mt-1 text-gray-500">
                  No prescriptions match the current filter.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPrescription ? "Edit Prescription" : "New Prescription"}</DialogTitle>
            <DialogDescription>
              {editingPrescription 
                ? "Update the prescription details below."
                : "Fill in the prescription details below."}
            </DialogDescription>
          </DialogHeader>
          
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
                        {appointments.map((appointment) => (
                          <SelectItem key={appointment.id} value={appointment.id}>
                            {format(new Date(appointment.appointment_date), 'PP')}
                          </SelectItem>
                        ))}
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
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name}
                            </SelectItem>
                          ))}
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
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingPrescription ? "Update" : "Create"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PrescriptionsManagement;
