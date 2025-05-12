
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Doctor } from "@/services/doctorsService";

// Specialization options
export const specializations = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology"
];

interface DoctorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Doctor;
  onSubmit: (doctor: Omit<Doctor, 'id'> | Doctor) => void;
  title: string;
  description: string;
  submitLabel: string;
}

export const DoctorForm = ({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit, 
  title, 
  description, 
  submitLabel 
}: DoctorFormProps) => {
  const [doctor, setDoctor] = useState<Omit<Doctor, 'id'> | Doctor>(
    {
      name: "",
      specialization: "",
      email: "",
      phone: "",
      schedule: "",
      available: true
    }
  );
  
  // Update form when initialData changes or when dialog opens
  useEffect(() => {
    if (initialData && open) {
      setDoctor(initialData);
    } else if (!open) {
      // Reset form when dialog closes
      setDoctor({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        schedule: "",
        available: true
      });
    }
  }, [initialData, open]);

  const handleChange = (field: keyof Doctor, value: string | boolean) => {
    setDoctor({ ...doctor, [field]: value });
  };

  const handleSubmit = () => {
    onSubmit(doctor);
    if (!initialData) {
      // Reset form if it's a new doctor
      setDoctor({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        schedule: "",
        available: true
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={doctor.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Dr. Full Name" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Select 
              onValueChange={(value) => handleChange('specialization', value)}
              value={doctor.specialization}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              value={doctor.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="doctor@hospital.com" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              value={doctor.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(555) 123-4567" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="schedule">Schedule</Label>
            <Input 
              id="schedule" 
              value={doctor.schedule}
              onChange={(e) => handleChange('schedule', e.target.value)}
              placeholder="Mon, Wed, Fri: 9AM - 5PM" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!doctor.name || !doctor.specialization || !doctor.email}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
