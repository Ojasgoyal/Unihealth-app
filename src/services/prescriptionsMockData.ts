
import { Prescription, CreatePrescriptionData } from "./prescriptionsService";

/**
 * Generates mock prescriptions for testing and fallback purposes
 * @param count Number of mock prescriptions to generate
 * @param baseData Optional base data to include in all generated prescriptions
 * @returns Array of mock prescriptions
 */
export const generateMockPrescriptions = (count: number = 1, baseData?: Partial<CreatePrescriptionData>): Prescription[] => {
  const mockPrescriptions: Prescription[] = [];
  
  // Create active prescription
  mockPrescriptions.push({
    id: "mock-id-1",
    appointment_id: baseData?.appointment_id || "mock-appointment-1",
    doctor_id: baseData?.doctor_id || "mock-doctor-1",
    patient_id: baseData?.patient_id || "mock-patient-1",
    medications: baseData?.medications || ["Amoxicillin 500mg", "Ibuprofen 400mg"],
    dosage: baseData?.dosage || "One tablet three times daily",
    instructions: baseData?.instructions || "Take after meals with plenty of water",
    issue_date: baseData?.issue_date || new Date().toISOString(),
    expiry_date: baseData?.expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: baseData?.status || "active",
    doctor: {
      name: "Dr. Sarah Johnson",
      specialization: "General Practitioner"
    },
    appointment: {
      appointment_date: new Date().toISOString()
    }
  });
  
  // If more than one prescription is needed, add a completed one
  if (count > 1) {
    mockPrescriptions.push({
      id: "rx-2",
      appointment_id: baseData?.appointment_id || "mock-appointment-2",
      doctor_id: baseData?.doctor_id || "mock-doctor-2",
      patient_id: baseData?.patient_id || "mock-patient-1",
      medications: ["Amoxicillin 500mg"],
      dosage: "Three times daily",
      instructions: "Take three times daily for 10 days",
      issue_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      expiry_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: "completed",
      doctor: {
        name: "Dr. Robert Miller",
        specialization: "General Physician"
      },
      appointment: {
        appointment_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
  }
  
  // Only return the requested number of prescriptions
  return mockPrescriptions.slice(0, count);
};

/**
 * Creates a single mock prescription for fallback 
 * when prescription creation fails
 */
export const createMockPrescription = (data: CreatePrescriptionData): Prescription => {
  return {
    id: "mock-id-" + Date.now(),
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expiry_date: data.expiry_date || null,
    status: data.status || "active"
  };
};
