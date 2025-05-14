
import { supabase } from "@/integrations/supabase/client";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithDoctor extends Appointment {
  doctor: {
    name: string;
    specialization: string;
    email: string;
  }
}

export interface AppointmentWithPatient extends Appointment {
  patient: {
    first_name: string;
    last_name: string;
    phone?: string;
  }
}

export const getAppointmentsForPatient = async (patientId: string): Promise<AppointmentWithDoctor[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      doctor:doctors(name, specialization, email)
    `)
    .eq('patient_id', patientId)
    .order('appointment_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
  
  return data || [];
};

export const getAppointmentsForDoctor = async (doctorId: string): Promise<AppointmentWithPatient[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:profiles(first_name, last_name, phone)
    `)
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
  
  return data || [];
};

export const getAllAppointments = async (): Promise<AppointmentWithPatient & {doctor: {name: string}}[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patient:profiles(first_name, last_name, phone),
      doctor:doctors(name)
    `)
    .order('appointment_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching all appointments:', error);
    throw error;
  }
  
  return data || [];
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
  
  return data;
};

export const updateAppointmentStatus = async (id: string, status: Appointment['status']): Promise<Appointment> => {
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

export const getAppointmentsForDate = async (doctorId: string, date: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('appointment_date', date)
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching appointments for date:', error);
    throw error;
  }
  
  return data || [];
};
