
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Prescription, 
  getAllPrescriptions, 
  createPrescription,
  updatePrescriptionStatus,
  CreatePrescriptionData
} from "@/services/prescriptionsService";

// Import our refactored components
import PrescriptionForm, { PrescriptionFormValues } from "@/components/prescriptions/PrescriptionForm";
import PrescriptionsList from "@/components/prescriptions/PrescriptionsList";
import EmptyPrescriptions from "@/components/prescriptions/EmptyPrescriptions";

const PrescriptionsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  // Fetch all prescriptions
  const { data: prescriptions = [], isLoading } = useQuery({
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

  // Handle form submission
  const handleFormSubmit = async (values: PrescriptionFormValues) => {
    try {
      // Convert comma-separated medications string to array
      const medicationsArray = values.medications.split(',').map(med => med.trim());
      
      const prescriptionData: CreatePrescriptionData = {
        appointment_id: values.appointment_id,
        doctor_id: values.doctor_id,
        patient_id: values.patient_id,
        medications: medicationsArray,
        dosage: values.dosage,
        instructions: values.instructions,
        issue_date: new Date(values.issue_date).toISOString(),
        status: values.status
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
    setIsDialogOpen(true);
  };

  // Open dialog for new prescription
  const handleAddNew = () => {
    setEditingPrescription(null);
    setIsDialogOpen(true);
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
              <PrescriptionsList 
                prescriptions={filteredPrescriptions} 
                onEdit={handleEdit} 
                onStatusChange={handleStatusUpdate} 
              />
            ) : (
              <EmptyPrescriptions filterType={activeTab !== "all" ? activeTab : undefined} />
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
          
          <PrescriptionForm
            onSubmit={handleFormSubmit}
            editingPrescription={editingPrescription}
            onCancel={() => setIsDialogOpen(false)}
            appointments={appointments}
            doctors={doctors}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PrescriptionsManagement;
