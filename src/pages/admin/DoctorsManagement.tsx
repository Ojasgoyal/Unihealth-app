
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, MoreVertical, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { DoctorForm } from "@/components/doctors/DoctorForm";
import { DeleteDoctorDialog } from "@/components/doctors/DeleteDoctorDialog";
import { 
  Doctor, 
  getDoctors, 
  addDoctor, 
  updateDoctor, 
  deleteDoctor,
  toggleDoctorAvailability
} from "@/services/doctorsService";
import { useAuth } from "@/contexts/AuthContext";

const DoctorsManagement = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

  // Fetch doctors from Supabase
  const { 
    data: doctors = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors
  });

  // Mutations for CRUD operations
  const addDoctorMutation = useMutation({
    mutationFn: addDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Doctor added",
        description: "The doctor has been added successfully.",
      });
      setAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error adding doctor",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateDoctorMutation = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Doctor updated",
        description: "The doctor's information has been updated.",
      });
      setEditDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error updating doctor",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteDoctorMutation = useMutation({
    mutationFn: (id: string) => deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Doctor removed",
        description: "The doctor has been removed from the system.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error removing doctor",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) => 
      toggleDoctorAvailability(id, available),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({
        title: "Availability updated",
        description: `${data.name} is now ${data.available ? 'available' : 'unavailable'}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating availability",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle adding a new doctor
  const handleAddDoctor = (doctor: Omit<Doctor, 'id'>) => {
    addDoctorMutation.mutate(doctor);
  };

  // Handle updating a doctor
  const handleUpdateDoctor = (doctor: Doctor) => {
    updateDoctorMutation.mutate(doctor);
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = () => {
    if (currentDoctor) {
      deleteDoctorMutation.mutate(currentDoctor.id);
    }
  };

  // Toggle doctor availability
  const handleToggleAvailability = (doctor: Doctor) => {
    toggleAvailabilityMutation.mutate({
      id: doctor.id,
      available: !doctor.available
    });
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    toast({
      title: "Error loading doctors",
      description: "There was a problem loading the doctors list.",
      variant: "destructive",
    });
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Doctors Management</h1>
            <p className="text-muted-foreground">
              Add, edit, and manage doctor profiles and availability
            </p>
          </div>
          <Button 
            className="bg-healthcare-primary"
            onClick={() => setAddDialogOpen(true)}
            disabled={!isAdmin}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Doctor
          </Button>
        </div>

        {/* Search */}
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search doctors by name, specialization, or email"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Doctors table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading doctors...
                  </TableCell>
                </TableRow>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialization}</TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{doctor.schedule}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 ${
                          doctor.available
                            ? "text-green-600 hover:text-green-700"
                            : "text-red-600 hover:text-red-700"
                        }`}
                        onClick={() => handleToggleAvailability(doctor)}
                        disabled={!isAdmin}
                      >
                        {doctor.available ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Unavailable</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentDoctor(doctor);
                              setEditDialogOpen(true);
                            }}
                            disabled={!isAdmin}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentDoctor(doctor);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 focus:text-red-600"
                            disabled={!isAdmin}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No doctors found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Doctor Dialog */}
      <DoctorForm
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddDoctor}
        title="Add New Doctor"
        description="Fill in the details to add a new doctor to the system."
        submitLabel="Add Doctor"
      />

      {/* Edit Doctor Dialog */}
      <DoctorForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialData={currentDoctor || undefined}
        onSubmit={handleUpdateDoctor}
        title="Edit Doctor"
        description="Update the doctor's information."
        submitLabel="Save Changes"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDoctorDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        doctor={currentDoctor}
        onConfirm={handleDeleteDoctor}
      />
    </DashboardLayout>
  );
};

export default DoctorsManagement;
