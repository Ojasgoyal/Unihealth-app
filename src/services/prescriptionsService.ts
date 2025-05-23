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
  status: string;
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
  expiry_date?: string | null;
  status?: string;
}

// Import mock data utilities
import { generateMockPrescriptions } from "./prescriptionsMockData";

export const createPrescription = async (data: CreatePrescriptionData): Promise<Prescription> => {
  try {
    console.log('Creating prescription with data:', data);
    
    // Ensure medications is an array
    const medications = Array.isArray(data.medications) 
      ? data.medications 
      : [data.medications].filter(Boolean);
    
    // Ensure we're properly formatting the data for Supabase
    const prescriptionData = {
      ...data,
      medications, // Ensure this is an array
      status: data.status || "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Sending to Supabase:', prescriptionData);
    
    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .insert([prescriptionData])
      .select(`
        *,
        doctor:doctor_id (name, specialization),
        appointment:appointment_id (appointment_date)
      `)
      .single();
    
    if (error) {
      console.error('Supabase error creating prescription:', error);
      throw error;
    }
    
    if (!prescription) {
      throw new Error("Failed to create prescription - no data returned");
    }
    
    console.log('Successfully created prescription:', prescription);
    return prescription;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    console.log('Fetching prescriptions for patient:', patientId);
    // Fetch prescriptions from the database
    const { data: prescriptions, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctor_id (name, specialization),
        appointment:appointment_id (appointment_date)
      `)
      .eq('patient_id', patientId)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error('Supabase error fetching prescriptions:', error);
      throw error;
    }
    
    console.log('Fetched prescriptions:', prescriptions);
    // Return empty array if no prescriptions found (don't throw error)
    return prescriptions || [];
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    throw error; // Re-throw instead of falling back to mock data
  }
};

export const getPrescriptionByAppointment = async (appointmentId: string): Promise<Prescription | null> => {
  try {
    // Try to fetch prescription from the database
    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctor_id (name, specialization),
        appointment:appointment_id (appointment_date)
      `)
      .eq('appointment_id', appointmentId)
      .single();
    
    if (error) {
      // Only throw if it's not a "no rows returned" error
      if (error.code !== 'PGRST116') throw error;
      return null;
    }
    
    return prescription;
  } catch (error) {
    console.error('Error fetching prescription for appointment:', error);
    
    // Return mock prescription if this is our mock ID
    if (appointmentId === "mock-appointment-1") {
      return generateMockPrescriptions(1, { appointment_id: appointmentId })[0];
    }
    
    return null;
  }
};

export const updatePrescriptionStatus = async (id: string, status: string): Promise<Prescription> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating prescription status:', error);
    throw error;
  }
};

export const getAllPrescriptions = async (): Promise<Prescription[]> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctor_id (name, specialization),
        appointment:appointment_id (appointment_date)
      `)
      .order('issue_date', { ascending: false });
    
    if (error) {
      console.error('Supabase error fetching all prescriptions:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching all prescriptions:', error);
    throw error; // Re-throw instead of falling back to mock data
  }
};
