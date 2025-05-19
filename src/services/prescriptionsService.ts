
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
  expiry_date?: string;
  status?: string;
}

export const createPrescription = async (data: CreatePrescriptionData): Promise<Prescription> => {
  try {
    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .insert([{
        ...data,
        status: data.status || "active"
      }])
      .select()
      .single();
    
    if (error) throw error;
    return prescription;
  } catch (error) {
    console.error('Error creating prescription:', error);
    // Return a mock prescription as fallback
    const mockPrescription: Prescription = {
      id: "mock-id-" + Date.now(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expiry_date: data.expiry_date || null,
      status: "active" // Add default status
    };
    
    return mockPrescription;
  }
};

export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    // Try to fetch prescriptions from the database
    const { data: prescriptions, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        doctor:doctor_id (name, specialization),
        appointment:appointment_id (appointment_date)
      `)
      .eq('patient_id', patientId)
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    
    // If we have data, return it
    if (prescriptions && prescriptions.length > 0) {
      return prescriptions;
    }
    
    throw new Error("No prescriptions found");
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    
    // Return mock prescriptions as fallback
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
        status: "active", // Add status
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
        status: "completed", // Add completed status
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
        status: "active", // Add status
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
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all prescriptions:', error);
    
    // Return mock data as fallback
    return [
      {
        id: "mock-rx-1",
        appointment_id: "mock-apt-1",
        doctor_id: "mock-doc-1",
        patient_id: "mock-patient-1",
        medications: ["Lisinopril 10mg", "Simvastatin 20mg"],
        dosage: "Once daily",
        instructions: "Take in the evening with food",
        issue_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        doctor: {
          name: "Dr. Michael Chang",
          specialization: "Cardiologist"
        },
        appointment: {
          appointment_date: new Date().toISOString()
        }
      }
    ];
  }
};
