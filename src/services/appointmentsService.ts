
import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  doctor?: {
    name: string;
    specialization: string;
    email: string;
  };
}

export interface CreateAppointmentData {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  notes?: string;
}

export const createAppointment = async (data: CreateAppointmentData): Promise<Appointment> => {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert([data])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
  
  return appointment;
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctor_id (
        name,
        specialization,
        email
      )
    `)
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching patient appointments:', error);
    throw error;
  }
  
  return data || [];
};

export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
  
  return data || [];
};

export const updateAppointmentStatus = async (
  id: string, 
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
  
  return data;
};
