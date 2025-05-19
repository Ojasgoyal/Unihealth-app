
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Calendar, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Prescription, getPatientPrescriptions, getPrescriptionByAppointment } from "@/services/prescriptionsService";
import { format, parseISO } from "date-fns";

const Prescriptions = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  
  // Hardcoded patient ID for demo - in a real app, this would come from authentication context
  const patientId = "123e4567-e89b-12d3-a456-426614174000";
  
  // If appointmentId is provided, fetch specific prescription
  const {
    data: specificPrescription,
    isLoading: isLoadingSpecific,
  } = useQuery({
    queryKey: ['prescription', appointmentId],
    queryFn: () => getPrescriptionByAppointment(appointmentId!),
    enabled: !!appointmentId,
  });
  
  // Fetch all patient prescriptions
  const {
    data: prescriptions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['patientPrescriptions', patientId],
    queryFn: () => getPatientPrescriptions(patientId),
    enabled: !appointmentId,
  });
  
  // Add mock recent prescriptions to ensure consistency with dashboard display
  const recentPrescriptions: Prescription[] = [
    {
      id: "rx-1",
      doctor_id: "mock-doctor-3",
      patient_id: patientId,
      appointment_id: "mock-appointment-3",
      doctor: {
        name: "Sarah Johnson",
        specialization: "Cardiologist"
      },
      issue_date: "2025-04-30T10:00:00Z",
      expiry_date: "2025-05-30T10:00:00Z",
      medications: ["Atenolol 50mg", "Aspirin 81mg"],
      instructions: "Take once daily with food",
      dosage: "Once daily",
      status: "Active",
      created_at: "2025-04-30T10:00:00Z",
      updated_at: "2025-04-30T10:00:00Z"
    },
    {
      id: "rx-2",
      doctor_id: "mock-doctor-4",
      patient_id: patientId,
      appointment_id: "mock-appointment-4",
      doctor: {
        name: "Robert Miller",
        specialization: "General Physician"
      },
      issue_date: "2025-04-15T14:30:00Z",
      expiry_date: "2025-04-25T14:30:00Z",
      medications: ["Amoxicillin 500mg"],
      instructions: "Take three times daily for 10 days",
      dosage: "Three times daily",
      status: "Completed",
      created_at: "2025-04-15T14:30:00Z",
      updated_at: "2025-04-15T14:30:00Z"
    }
  ];
  
  // Combine API results with mock data, ensuring no duplicates by ID
  const allPrescriptions = [...prescriptions];
  recentPrescriptions.forEach(mockPrescription => {
    if (!allPrescriptions.some(p => p.id === mockPrescription.id)) {
      allPrescriptions.push(mockPrescription);
    }
  });
  
  // Dummy function for download - in a real app this would generate a PDF
  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your prescription is being prepared for download."
    });
  };
  
  if (error) {
    toast({
      title: "Error loading prescriptions",
      description: "There was a problem loading your prescriptions.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Prescriptions</h1>
          <p className="text-muted-foreground">View and download your medical prescriptions</p>
        </div>
        
        {appointmentId && specificPrescription ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Prescription Details</CardTitle>
                  <CardDescription>
                    Prescribed on {format(parseISO(specificPrescription.issue_date), "MMMM d, yyyy")}
                  </CardDescription>
                </div>
                <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Medications</h3>
                  <ul className="mt-2 space-y-2">
                    {specificPrescription.medications.map((med, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2 mt-0.5">Rx</span>
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Dosage</h3>
                  <p className="mt-1 text-gray-600">{specificPrescription.dosage}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Instructions</h3>
                  <p className="mt-1 text-gray-600">{specificPrescription.instructions}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-md font-medium">Prescribed By</h3>
                  <p className="text-gray-600">
                    Dr. {specificPrescription.doctor?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {specificPrescription.doctor?.specialization}
                  </p>
                </div>
                
                {specificPrescription.expiry_date && (
                  <div className="bg-amber-50 p-4 rounded-md">
                    <p className="text-amber-800 text-sm">
                      Valid until: {format(parseISO(specificPrescription.expiry_date), "MMMM d, yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : isLoading || isLoadingSpecific ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-primary"></div>
          </div>
        ) : allPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {allPrescriptions.map((prescription) => (
              <Card key={prescription.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-healthcare-primary" />
                        <h3 className="text-lg font-medium">Prescription</h3>
                        <span 
                          className={`ml-2 text-xs px-2 py-1 rounded-full ${
                            prescription.status === "Active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {prescription.status}
                        </span>
                      </div>
                      
                      <p className="mt-2 font-medium">
                        Dr. {prescription.doctor?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {prescription.doctor?.specialization}
                      </p>
                      
                      <div className="mt-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          Issued on {format(parseISO(prescription.issue_date), "MMMM d, yyyy")}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium">Medications:</h4>
                        <ul className="mt-1">
                          {prescription.medications.map((med, index) => (
                            <li key={index} className="text-sm text-gray-600">{med}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {prescription.instructions && (
                        <div className="mt-2 text-xs text-gray-500">
                          {prescription.instructions}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start justify-between">
                      <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      
                      {prescription.expiry_date && (
                        <div className="mt-6 text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded">
                          Valid until: {format(parseISO(prescription.expiry_date), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No prescriptions found</h3>
            <p className="mt-1 text-gray-500">
              You don't have any prescriptions yet. They will appear here after your doctor visits.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;
