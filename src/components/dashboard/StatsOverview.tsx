
import { Users, Bed, Calendar, FilePlus } from "lucide-react";
import { StatCard } from "./StatCard";

// Mock data for stats
const stats = [
  {
    title: "Total Doctors",
    value: "24",
    description: "Active medical staff",
    icon: <Users className="h-5 w-5 text-healthcare-primary" />,
    change: "+2 this month"
  },
  {
    title: "Total Beds",
    value: "150",
    description: "Hospital capacity",
    icon: <Bed className="h-5 w-5 text-healthcare-primary" />,
    change: "90% occupancy"
  },
  {
    title: "Today's Appointments",
    value: "37",
    description: "Scheduled for today",
    icon: <Calendar className="h-5 w-5 text-healthcare-primary" />,
    change: "5 pending approval"
  },
  {
    title: "New Prescriptions",
    value: "12",
    description: "Created today",
    icon: <FilePlus className="h-5 w-5 text-healthcare-primary" />,
    change: "+4 since yesterday"
  }
];

export const StatsOverview = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
