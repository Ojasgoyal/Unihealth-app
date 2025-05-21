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
  patient?: {
    first_name?: string;
    last_name?: string;
  };
}

export interface CreateAppointmentData {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  reason?: string | null;
  notes?: string | null;
}

export const createAppointment = async (data: CreateAppointmentData): Promise<Appointment> => {
  try {
    const appointmentData = {
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reason: data.reason || null,
      notes: data.notes || null
    };

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select(`
        *,
        doctor:doctor_id (
          name,
          specialization,
          email
        )
      `)
      .single();
    
    if (error) throw error;
    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  try {
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
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    throw error;
  }
};

export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
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
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
};

export const updateAppointmentStatus = async (
  id: string, 
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<Appointment> => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`
        *,
        doctor:doctor_id (
          name,
          specialization,
          email
        )
      `)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    throw error;
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
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
      .eq('id', id)
      .single();
    
    if (error) {
      // If it's a "no rows returned" error, return null
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

export const getAppointmentsByStatus = async (status: string): Promise<Appointment[]> => {
  try {
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
      .eq('status', status)
      .order('appointment_date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${status} appointments:`, error);
    throw error;
  }
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    // Modified query to properly handle the patient relation
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
      .order('appointment_date', { ascending: false });
    
    if (error) throw error;
    
    // Manually process the data to match the expected type
    const processedAppointments: Appointment[] = data.map((appointment: any) => {
      // Extract all the fields from the appointment
      const {
        id,
        patient_id,
        doctor_id,
        appointment_date,
        start_time,
        end_time,
        reason,
        notes,
        status,
        created_at,
        updated_at,
        doctor
      } = appointment;

      // Create a processed appointment object with the expected shape
      return {
        id,
        patient_id,
        doctor_id,
        appointment_date,
        start_time,
        end_time,
        reason,
        notes,
        status,
        created_at,
        updated_at,
        doctor,
        // Set a default patient object to match the expected type
        patient: {
          first_name: undefined,
          last_name: undefined
        }
      };
    });
    
    return processedAppointments;
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    throw error;
  }
};
