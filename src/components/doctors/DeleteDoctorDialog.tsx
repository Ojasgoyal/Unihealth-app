
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Doctor } from "@/services/doctorsService";

interface DeleteDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor | null;
  onConfirm: () => void;
}

export const DeleteDoctorDialog = ({ 
  open, 
  onOpenChange, 
  doctor, 
  onConfirm 
}: DeleteDoctorDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {doctor?.name} from the system? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
          >
            Remove Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
