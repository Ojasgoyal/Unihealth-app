import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Hospital,
  User,
  Bed,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type SidebarProps = {
  userRole: "admin" | "patient";
};

export const Sidebar = ({ userRole }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await signOut();
    // Navigation is handled in the AuthContext
  };

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Doctors",
      href: "/admin/doctors",
      icon: Users,
    },
    {
      title: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      title: "Prescriptions",
      href: "/admin/prescriptions",
      icon: FileText,
    },
  ];

  const patientNavItems = [
    {
      title: "Dashboard",
      href: "/patient-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Find Doctor",
      href: "/patient/find-doctor",
      icon: UserPlus,
    },
    {
      title: "My Appointments",
      href: "/patient/appointments",
      icon: Calendar,
    },
    {
      title: "My Prescriptions",
      href: "/patient/prescriptions",
      icon: ClipboardList,
    },
  ];

  const navItems = userRole === "admin" ? adminNavItems : patientNavItems;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileSidebar}
          className="bg-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar for Mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 md:hidden",
          mobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {userRole === "admin" ? (
                <Hospital className="h-6 w-6 text-healthcare-primary" />
              ) : (
                <User className="h-6 w-6 text-healthcare-primary" />
              )}
              <span className="font-semibold text-lg">
                {userRole === "admin" ? "Admin Panel" : "Patient Portal"}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileSidebar}
            >
              <X size={18} />
            </Button>
          </div>

          <Separator />

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-healthcare-light text-healthcare-primary"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 text-gray-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar for Desktop */}
      <aside
        className={cn(
          "hidden md:block h-full bg-white border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center">
            {userRole === "admin" ? (
              <Hospital className="h-6 w-6 text-healthcare-primary" />
            ) : (
              <User className="h-6 w-6 text-healthcare-primary" />
            )}
            {!collapsed && (
              <span className="ml-2 font-semibold text-lg">
                {userRole === "admin" ? "Admin Panel" : "Patient Portal"}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="ml-auto"
            >
              <Menu size={18} />
            </Button>
          </div>

          <Separator />

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-healthcare-light text-healthcare-primary"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              <Settings className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Settings</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 w-full text-left rounded-md hover:bg-gray-100 text-gray-700"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
