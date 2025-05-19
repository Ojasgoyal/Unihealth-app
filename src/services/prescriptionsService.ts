
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
  const { data: prescription, error } = await supabase
    .from('prescriptions')
    .insert([data])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
  
  return prescription;
};

export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      doctor:doctor_id (
        name,
        specialization
      ),
      appointment:appointment_id (
        appointment_date
      )
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching patient prescriptions:', error);
    throw error;
  }
  
  return data || [];
};

export const getPrescriptionByAppointment = async (appointmentId: string): Promise<Prescription | null> => {
  const { data, error } = await supabase
    .from('prescriptions')
    .select()
    .eq('appointment_id', appointmentId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching prescription:', error);
    throw error;
  }
  
  return data;
};
