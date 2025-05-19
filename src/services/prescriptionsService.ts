
import { supabase } from "@/integrations/supabase/client";

export interface Prescription {
  id: string;
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  medications: string[];
  dosage: string;
  instructions: string;
  issue_date: string;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
  status?: string; // Add optional status field
  doctor?: {
    name: string;
    specialization: string;
  };
  appointment?: {
    appointment_date: string;
  };
}

export interface CreatePrescriptionData {
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  medications: string[];
  dosage: string;
  instructions: string;
  issue_date: string;
  expiry_date?: string;
}

export const createPrescription = async (data: CreatePrescriptionData): Promise<Prescription> => {
  // Since we don't have the prescriptions table yet, we'll mock the response
  console.log("Creating prescription:", data);
  
  // Return a mock prescription
  const mockPrescription: Prescription = {
    id: "mock-id-" + Date.now(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expiry_date: data.expiry_date || null,
    status: "Active" // Add default status
  };
  
  return mockPrescription;
};

export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  // Since we don't have the prescriptions table yet, we'll return mock data
  console.log("Fetching prescriptions for patient:", patientId);
  
  // Return mock prescriptions
  const mockPrescriptions: Prescription[] = [
    {
      id: "mock-id-1",
      appointment_id: "mock-appointment-1",
      doctor_id: "mock-doctor-1",
      patient_id: patientId,
      medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"],
      dosage: "One tablet three times daily",
      instructions: "Take after meals with plenty of water",
      issue_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "Active", // Add status
      doctor: {
        name: "Dr. Sarah Johnson",
        specialization: "General Practitioner"
      },
      appointment: {
        appointment_date: new Date().toISOString()
      }
    },
    // Additional mock prescription with Completed status
    {
      id: "rx-2",
      appointment_id: "mock-appointment-2",
      doctor_id: "mock-doctor-2",
      patient_id: patientId,
      medications: ["Amoxicillin 500mg"],
      dosage: "Three times daily",
      instructions: "Take three times daily for 10 days",
      issue_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      expiry_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Completed", // Add completed status
      doctor: {
        name: "Dr. Robert Miller",
        specialization: "General Physician"
      },
      appointment: {
        appointment_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];
  
  return mockPrescriptions;
};

export const getPrescriptionByAppointment = async (appointmentId: string): Promise<Prescription | null> => {
  // Since we don't have the prescriptions table yet, we'll check if this is a mock ID
  console.log("Fetching prescription for appointment:", appointmentId);
  
  if (appointmentId === "mock-appointment-1") {
    // Return a mock prescription
    return {
      id: "mock-id-1",
      appointment_id: appointmentId,
      doctor_id: "mock-doctor-1",
      patient_id: "mock-patient-1",
      medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"],
      dosage: "One tablet three times daily",
      instructions: "Take after meals with plenty of water",
      issue_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "Active", // Add status
      doctor: {
        name: "Dr. Sarah Johnson",
        specialization: "General Practitioner"
      },
      appointment: {
        appointment_date: new Date().toISOString()
      }
    };
  }
  
  return null;
};
