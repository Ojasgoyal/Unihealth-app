
import React from 'react';
import { FileText } from 'lucide-react';

interface EmptyPrescriptionsProps {
  filterType?: string;
}

export const EmptyPrescriptions: React.FC<EmptyPrescriptionsProps> = ({ filterType }) => {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 mx-auto text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">No prescriptions found</h3>
      <p className="mt-1 text-gray-500">
        {filterType ? `No prescriptions match the ${filterType} filter.` : 'No prescriptions available.'}
      </p>
    </div>
  );
};

export default EmptyPrescriptions;
