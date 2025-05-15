
import React from "react";
import { Sidebar } from "@/components/layouts/Sidebar";
import { Header } from "@/components/layouts/Header";

type DashboardLayoutProps = {
  children: React.ReactNode;
  userRole: "admin" | "patient";
};

export const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar 
          open={sidebarOpen} 
          setOpen={setSidebarOpen}
        />
      </div>
      
      {/* Content area */}
      <div className="flex flex-col flex-1 transition-all duration-300 ease-in-out" 
           style={{ marginLeft: sidebarOpen ? '0' : '-16rem' }}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
