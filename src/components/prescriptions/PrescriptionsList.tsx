
import React from 'react';
import { format } from 'date-fns';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Prescription } from '@/services/prescriptionsService';

interface PrescriptionsListProps {
  prescriptions: Prescription[];
  onEdit: (prescription: Prescription) => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

export const PrescriptionsList: React.FC<PrescriptionsListProps> = ({ 
  prescriptions, 
  onEdit, 
  onStatusChange 
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Medications</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell className="font-mono text-xs">{prescription.id.substring(0, 8)}...</TableCell>
              <TableCell>{prescription.patient_id.substring(0, 8)}...</TableCell>
              <TableCell>
                {prescription.doctor?.name || "Unknown"}
                <p className="text-xs text-muted-foreground">{prescription.doctor?.specialization}</p>
              </TableCell>
              <TableCell>
                <ul className="text-sm">
                  {Array.isArray(prescription.medications) ? (
                    prescription.medications.map((med, i) => <li key={i}>{med}</li>)
                  ) : (
                    <li>{String(prescription.medications)}</li>
                  )}
                </ul>
              </TableCell>
              <TableCell>
                {prescription.issue_date ? format(new Date(prescription.issue_date), 'MMM dd, yyyy') : 'N/A'}
              </TableCell>
              <TableCell>
                <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
                  prescription.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : prescription.status === 'completed' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {prescription.status || "Unknown"}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(prescription)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Select 
                    defaultValue={prescription.status} 
                    onValueChange={(value) => onStatusChange(prescription.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrescriptionsList;
