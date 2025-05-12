
import { Bed } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Mock data for bed availability
const bedAvailability = [
  { ward: "General Ward", total: 80, occupied: 68, available: 12 },
  { ward: "ICU", total: 20, occupied: 15, available: 5 },
  { ward: "Pediatric", total: 30, occupied: 22, available: 8 },
  { ward: "Maternity", total: 20, occupied: 12, available: 8 }
];

export const BedAvailability = () => {
  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bed Availability</CardTitle>
            <CardDescription>Current hospital capacity</CardDescription>
          </div>
          <Bed className="h-5 w-5 text-healthcare-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {bedAvailability.map((ward, index) => {
            const occupancyRate = Math.round((ward.occupied / ward.total) * 100);
            let progressColor = "bg-healthcare-primary";
            
            if (occupancyRate > 90) {
              progressColor = "bg-red-500";
            } else if (occupancyRate > 75) {
              progressColor = "bg-yellow-500";
            } else if (occupancyRate > 50) {
              progressColor = "bg-green-500";
            }
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-medium">{ward.ward}</p>
                  <p className="text-sm">
                    <span className="font-semibold">{ward.available}</span> available / {ward.total} total
                  </p>
                </div>
                <Progress 
                  value={occupancyRate} 
                  className="h-2"
                  indicatorClassName={progressColor}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
