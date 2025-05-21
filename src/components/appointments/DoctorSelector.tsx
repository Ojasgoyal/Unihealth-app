
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDoctors, Doctor } from "@/services/doctorsService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DoctorSelectorProps {
  selectedDoctor: Doctor | null;
  onDoctorChange: (doctor: Doctor | null) => void;
  isDisabled?: boolean;
}

const DoctorSelector = ({ 
  selectedDoctor, 
  onDoctorChange,
  isDisabled = false
}: DoctorSelectorProps) => {
  // Fetch doctors
  const { data: doctors = [], isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['appointmentDoctors'],
    queryFn: getDoctors
  });

  // Filter doctors to show only available ones
  const availableDoctors = doctors.filter(doc => doc.available);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Doctor</label>
      <Select
        value={selectedDoctor?.id}
        onValueChange={(doctorId) => {
          const selected = doctors.find(d => d.id === doctorId);
          onDoctorChange(selected || null);
        }}
        disabled={isDisabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a doctor" />
        </SelectTrigger>
        <SelectContent>
          {isLoadingDoctors ? (
            <SelectItem value="loading-doctors">Loading doctors...</SelectItem>
          ) : availableDoctors.length > 0 ? (
            availableDoctors.map((doc) => (
              <SelectItem key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialization}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-doctors-available">No available doctors</SelectItem>
          )}
        </SelectContent>
      </Select>
      {selectedDoctor && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium">{selectedDoctor.name}</h4>
          <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
          <p className="text-xs text-gray-500 mt-1">Schedule: {selectedDoctor.schedule}</p>
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;
