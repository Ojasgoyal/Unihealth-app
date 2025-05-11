
import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Mock doctor data
const initialDoctors = [
  {
    id: 1,
    name: "Dr. Michael Stevens",
    specialization: "Cardiology",
    email: "michael.stevens@hospital.com",
    phone: "(555) 123-4567",
    available: true,
    schedule: "Mon, Wed, Fri: 9AM - 5PM"
  },
  {
    id: 2,
    name: "Dr. Emily Chen",
    specialization: "Pediatrics",
    email: "emily.chen@hospital.com",
    phone: "(555) 234-5678",
    available: true,
    schedule: "Mon, Tue, Thu: 8AM - 4PM"
  },
  {
    id: 3,
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    email: "james.wilson@hospital.com",
    phone: "(555) 345-6789",
    available: true,
    schedule: "Tue, Thu, Fri: 10AM - 6PM"
  },
  {
    id: 4,
    name: "Dr. Lisa Thompson",
    specialization: "Neurology",
    email: "lisa.thompson@hospital.com",
    phone: "(555) 456-7890",
    available: false,
    schedule: "Wed, Thu, Fri: 9AM - 5PM"
  },
  {
    id: 5,
    name: "Dr. Robert Miller",
    specialization: "Dermatology",
    email: "robert.miller@hospital.com",
    phone: "(555) 567-8901",
    available: true,
    schedule: "Mon, Wed: 8AM - 6PM"
  },
];

// Specialization options
const specializations = [
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

const DoctorsManagement = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    schedule: ""
  });

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new doctor
  const handleAddDoctor = () => {
    const id = Math.max(...doctors.map(doc => doc.id), 0) + 1;
    const doctorToAdd = {
      ...newDoctor,
      id,
      available: true
    };

    setDoctors([...doctors, doctorToAdd]);
    setNewDoctor({
      name: "",
      specialization: "",
      email: "",
      phone: "",
      schedule: ""
    });
    setAddDialogOpen(false);
    
    toast({
      title: "Doctor added",
      description: `${newDoctor.name} has been added successfully.`,
    });
  };

  // Handle updating a doctor
  const handleUpdateDoctor = () => {
    if (!currentDoctor) return;
    
    const updatedDoctors = doctors.map(doctor => 
      doctor.id === currentDoctor.id ? currentDoctor : doctor
    );
    
    setDoctors(updatedDoctors);
    setEditDialogOpen(false);
    
    toast({
      title: "Doctor updated",
      description: `${currentDoctor.name}'s information has been updated.`,
    });
  };

  // Handle deleting a doctor
  const handleDeleteDoctor = () => {
    if (!currentDoctor) return;
    
    const updatedDoctors = doctors.filter(doctor => doctor.id !== currentDoctor.id);
    setDoctors(updatedDoctors);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Doctor removed",
      description: `${currentDoctor.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  // Toggle doctor availability
  const toggleAvailability = (id: number) => {
    const updatedDoctors = doctors.map(doctor => {
      if (doctor.id === id) {
        const updatedDoctor = { ...doctor, available: !doctor.available };
        return updatedDoctor;
      }
      return doctor;
    });
    
    setDoctors(updatedDoctors);
    
    const doctor = doctors.find(doc => doc.id === id);
    if (doctor) {
      toast({
        title: `Availability updated`,
        description: `${doctor.name} is now ${!doctor.available ? 'available' : 'unavailable'}.`,
      });
    }
  };

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
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-primary">
                <Plus className="mr-2 h-4 w-4" /> Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new doctor to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    placeholder="Dr. Full Name" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select 
                    onValueChange={(value) => setNewDoctor({ ...newDoctor, specialization: value })}
                    value={newDoctor.specialization}
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
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    placeholder="doctor@hospital.com" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    placeholder="(555) 123-4567" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input 
                    id="schedule" 
                    value={newDoctor.schedule}
                    onChange={(e) => setNewDoctor({ ...newDoctor, schedule: e.target.value })}
                    placeholder="Mon, Wed, Fri: 9AM - 5PM" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddDoctor}
                  disabled={!newDoctor.name || !newDoctor.specialization || !newDoctor.email}
                >
                  Add Doctor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and filters */}
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
              {filteredDoctors.length > 0 ? (
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
                        onClick={() => toggleAvailability(doctor.id)}
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

      {/* Edit Doctor Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogDescription>
              Update the doctor's information.
            </DialogDescription>
          </DialogHeader>
          {currentDoctor && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentDoctor.name}
                  onChange={(e) => setCurrentDoctor({ ...currentDoctor, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-specialization">Specialization</Label>
                <Select 
                  value={currentDoctor.specialization}
                  onValueChange={(value) => setCurrentDoctor({ ...currentDoctor, specialization: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={currentDoctor.email}
                  onChange={(e) => setCurrentDoctor({ ...currentDoctor, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input 
                  id="edit-phone" 
                  value={currentDoctor.phone}
                  onChange={(e) => setCurrentDoctor({ ...currentDoctor, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-schedule">Schedule</Label>
                <Input 
                  id="edit-schedule" 
                  value={currentDoctor.schedule}
                  onChange={(e) => setCurrentDoctor({ ...currentDoctor, schedule: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateDoctor}
              disabled={!currentDoctor?.name || !currentDoctor?.specialization || !currentDoctor?.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {currentDoctor?.name} from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteDoctor}
            >
              Remove Doctor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorsManagement;
