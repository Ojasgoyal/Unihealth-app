import { useState } from "react";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type HeaderProps = {
  userRole: "admin" | "patient";
};

export const Header = ({ userRole }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Search initiated",
        description: `Searching for: ${searchQuery}`,
      });
      // Implement search functionality
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Use real profile data without fallbacks to dummy data
  const userName = profile ? 
    `${profile.first_name || ''} ${profile.last_name || ''}` : 
    "User";
  
  const userEmail = profile?.email || "";
  
  const userInitials = profile ? 
    `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` : 
    "U";

  // Get actual notifications - for now, we'll create a placeholder
  // that shows no notifications instead of dummy data
  const userNotifications = [];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">
            {userRole === "admin" ? "Hospital Admin Dashboard" : "Patient Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-gray-50 pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {userNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {userNotifications.length > 0 ? (
                  userNotifications.map((notification, index) => (
                    <DropdownMenuItem key={index} className="p-3 cursor-pointer">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
              {userNotifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-center">
                    <Button variant="ghost" className="w-full">View all notifications</Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-gray-500">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
