
import { AlertCircle, UserCheck, CheckCircle, XCircle } from "lucide-react";

interface AppointmentStatusBadgeProps {
  status: string;
}

export const getStatusBadge = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    case "confirmed":
      return <UserCheck className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  return (
    <div className={`px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 font-medium ${getStatusBadge(status)}`}>
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default AppointmentStatusBadge;
