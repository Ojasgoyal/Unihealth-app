
import { supabase } from "@/integrations/supabase/client";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  schedule: string;
  available: boolean;
}

export const getDoctors = async (): Promise<Doctor[]> => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
  
  return data || [];
};

export const addDoctor = async (doctor: Omit<Doctor, 'id'>): Promise<Doctor> => {
  const { data, error } = await supabase
    .from('doctors')
    .insert([doctor])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding doctor:', error);
    throw error;
  }
  
  return data;
};

export const updateDoctor = async (doctor: Doctor): Promise<Doctor> => {
  const { data, error } = await supabase
    .from('doctors')
    .update(doctor)
    .eq('id', doctor.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
  
  return data;
};

export const deleteDoctor = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('doctors')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};

export const toggleDoctorAvailability = async (id: string, available: boolean): Promise<Doctor> => {
  const { data, error } = await supabase
    .from('doctors')
    .update({ available })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error toggling doctor availability:', error);
    throw error;
  }
  
  return data;
};
