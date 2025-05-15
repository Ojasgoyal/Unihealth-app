
import {
  Home,
  Calendar,
  Search,
  Users,
  LayoutDashboard,
  ListChecks,
  User,
  ChevronLeft,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({
  className,
  open,
  setOpen
}: SidebarProps) {
  const pathname = useLocation().pathname;
  const { user, isAdmin } = useAuth();

  // Combine routes - for showcase purposes, we'll show both admin and patient routes
  const patientRoutes = [
    {
      title: "Patient Dashboard",
      href: "/patient-dashboard",
      icon: <Home className="h-4 w-4" />,
      active: pathname === "/patient-dashboard",
    },
    {
      title: "Appointments",
      href: "/patient/appointments",
      icon: <Calendar className="h-4 w-4" />,
      active: pathname === "/patient/appointments",
    },
    {
      title: "Find Doctor",
      href: "/patient/find-doctor",
      icon: <Search className="h-4 w-4" />,
      active: pathname === "/patient/find-doctor",
    },
  ];

  const adminRoutes = [
    {
      title: "Admin Dashboard",
      href: "/admin-dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: pathname === "/admin-dashboard",
    },
    {
      title: "Doctors Management",
      href: "/admin/doctors",
      icon: <Users className="h-4 w-4" />,
      active: pathname === "/admin/doctors",
    },
  ];

  // For showcase purposes - show both route sets
  const routes = [...patientRoutes, ...adminRoutes];

  return (
    <aside
      className={`fixed left-0 top-0 z-20 h-screen w-64 flex-col bg-background pt-14 pb-4 border-r border-r-border transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${className}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end pr-2 mb-2 md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 space-y-2 p-4">
          <h2 className="pb-2 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <NavLink
                key={route.href}
                to={route.href}
                className={({ isActive }) =>
                  `group flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none ${
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground"
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setOpen(false);
                  }
                }}
              >
                {route.icon}
                <span>{route.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
