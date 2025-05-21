
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Hospital, UserRound, Calendar, Clock, Search, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, profile } = useAuth();

  const handleExplore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(isAuthenticated ? getDashboardRoute() : "/login");
    }, 500);
  };

  // Helper function to get the appropriate dashboard route based on user role
  const getDashboardRoute = () => {
    if (!profile) return "/";
    return profile.role === "patient" ? "/patient-dashboard" : "/admin-dashboard";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="healthcare-container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-healthcare-primary" />
            <h1 className="text-2xl font-bold text-gray-900">UniHealth</h1>
          </div>
          <div className="flex space-x-2">
            {isAuthenticated ? (
              <Button 
                onClick={() => navigate(getDashboardRoute())}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="healthcare-section">
        <div className="healthcare-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Integrated Healthcare
                <span className="block text-healthcare-primary">Platform</span>
              </h1>
              <p className="text-lg text-gray-600">
                Connect patients with quality healthcare services through our unified platform. 
                Easy appointment booking, doctor management, and more.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button 
                  size="lg" 
                  onClick={handleExplore}
                  disabled={loading}
                  className="bg-healthcare-primary hover:bg-healthcare-secondary"
                >
                  {loading ? "Loading..." : "Get Started"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Healthcare professional with patient" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="healthcare-section bg-gray-50">
        <div className="healthcare-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Features</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to manage healthcare services</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <UserRound className="h-10 w-10 text-healthcare-primary" />, 
                title: "Doctor Management", 
                description: "Add, edit and manage doctor profiles and their availability" 
              },
              { 
                icon: <Calendar className="h-10 w-10 text-healthcare-primary" />, 
                title: "Appointment Booking", 
                description: "Easy and flexible appointment scheduling system" 
              },
              { 
                icon: <Clock className="h-10 w-10 text-healthcare-primary" />, 
                title: "Real-time Availability", 
                description: "Track and update bed availability in real time" 
              },
              { 
                icon: <Search className="h-10 w-10 text-healthcare-primary" />, 
                title: "Search Functionality", 
                description: "Find doctors and hospitals by location or specialization" 
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow card-hover">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="healthcare-section">
        <div className="healthcare-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Who It's For</h2>
            <p className="mt-4 text-lg text-gray-600">Designed for both healthcare providers and patients</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-healthcare-primary flex items-center justify-center">
                <Hospital className="h-20 w-20 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">Hospital Administrators</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-primary mr-2 mt-0.5" />
                    <span>Manage doctor profiles and schedules</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-primary mr-2 mt-0.5" />
                    <span>Update bed availability in real-time</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-primary mr-2 mt-0.5" />
                    <span>Handle appointment requests and assignments</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-primary mr-2 mt-0.5" />
                    <span>Upload and manage patient prescriptions</span>
                  </li>
                </ul>
                <Button 
                  className="mt-6 w-full"
                  onClick={() => navigate("/login")}
                >
                  Admin Login
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-healthcare-secondary flex items-center justify-center">
                <UserRound className="h-20 w-20 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">Patients</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-secondary mr-2 mt-0.5" />
                    <span>Easy registration and account management</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-secondary mr-2 mt-0.5" />
                    <span>Search for doctors by location or specialty</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-secondary mr-2 mt-0.5" />
                    <span>Book appointments with preferred doctors</span>
                  </li>
                  <li className="flex items-start">
                    <PlusCircle className="h-5 w-5 text-healthcare-secondary mr-2 mt-0.5" />
                    <span>View and download prescription history</span>
                  </li>
                </ul>
                <Button 
                  className="mt-6 w-full bg-healthcare-secondary hover:bg-healthcare-primary"
                  onClick={() => navigate("/register")}
                >
                  Patient Registration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="healthcare-section bg-healthcare-light">
        <div className="healthcare-container py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join our platform to streamline healthcare management and improve patient experience
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate(getDashboardRoute())}
                  className="bg-healthcare-primary hover:bg-healthcare-secondary"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/register")}
                  className="bg-healthcare-primary hover:bg-healthcare-secondary"
                >
                  Create Account
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  toast({
                    title: "Demo Coming Soon",
                    description: "Our demo is currently under development. Please check back later.",
                  });
                }}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="healthcare-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Hospital className="h-6 w-6 text-healthcare-primary" />
                <span className="text-xl font-bold">UniHealth</span>
              </div>
              <p className="mt-4 text-gray-400">
                Connecting patients with quality healthcare services through a unified platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">123 Healthcare Ave, Medical District</p>
              <p className="text-gray-400">support@mediconnect.example</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <p>&copy; 2025 UniHealth Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
