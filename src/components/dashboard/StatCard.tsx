
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  change: string;
}

export const StatCard = ({ title, value, description, icon, change }: StatCardProps) => {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-healthcare-primary mt-2">{change}</p>
      </CardContent>
    </Card>
  );
};
