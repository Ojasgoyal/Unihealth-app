import {
  Home,
  Calendar,
  Search,
  Users,
  LayoutDashboard,
  ListChecks,
  User,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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

  const patientRoutes = [
    {
      title: "Dashboard",
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
      title: "Dashboard",
      href: "/admin-dashboard",
      icon: <Home className="h-4 w-4" />,
      active: pathname === "/admin-dashboard",
    },
    {
      title: "Doctors",
      href: "/admin/doctors",
      icon: <Users className="h-4 w-4" />,
      active: pathname === "/admin/doctors",
    },
  ];

  const routes = isAdmin ? adminRoutes : patientRoutes;

  return (
    <aside
      className={`fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-72 flex-col overflow-y-auto border-r border-r-border bg-background pt-5 pb-4 transition-transform duration-300 ease-in-out dark:border-r-muted ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${className}`}
    >
      <div className="flex flex-col space-y-1">
        <div className="flex-1 space-y-2 p-6">
          <h2 className="pb-2 text-lg font-semibold tracking-tight">
            {isAdmin ? "Admin" : "Patient"}
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
