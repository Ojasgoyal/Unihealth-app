
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Hospital, Calendar, Search, User, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading, isAdmin } = useAuth();

  // Redirect logged in users to their appropriate dashboard
  if (!loading && user) {
    return <Navigate to={isAdmin ? "/admin-dashboard" : "/patient-dashboard"} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hospital className="h-6 w-6 text-healthcare-primary" />
            <span className="text-xl font-bold">Unihealth</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Unihealth offers integrated healthcare solutions with easy access to doctors, 
              online appointments, and personalized care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Unihealth?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-healthcare-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Easy Appointments</h3>
              <p className="text-gray-600">
                Schedule appointments online with just a few clicks and manage your bookings effortlessly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-healthcare-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Find Specialists</h3>
              <p className="text-gray-600">
                Search for doctors by specialization, read reviews, and choose the best healthcare provider for you.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-healthcare-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Personal Health Records</h3>
              <p className="text-gray-600">
                Access your medical history, prescriptions, and test results in one secure location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Patients Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="ml-4">
                  <p className="font-medium">Sarah Johnson</p>
                  <div className="flex text-yellow-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Unihealth has transformed how I manage my healthcare. The appointment system is so easy to use, and I love being able to see all my medical records in one place."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="ml-4">
                  <p className="font-medium">Michael Brown</p>
                  <div className="flex text-yellow-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Finding the right specialist used to be so difficult, but with Unihealth I was able to quickly find a great cardiologist and book an appointment the same day."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-healthcare-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to take control of your health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have transformed their healthcare experience with Unihealth.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <Hospital className="h-6 w-6" />
                <span className="text-xl font-bold">Unihealth</span>
              </div>
              <p className="mt-2 text-gray-400 max-w-xs">
                Integrated healthcare platform providing seamless access to medical services.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3">Services</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Appointments</li>
                  <li>Find Doctors</li>
                  <li>Health Records</li>
                  <li>Prescriptions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Contact</li>
                  <li>Press</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Cookie Policy</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Unihealth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
