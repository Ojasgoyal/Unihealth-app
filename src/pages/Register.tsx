
import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Hospital, UserRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signUp } from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";

// Define the form data type
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    }
  });

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/patient-dashboard" replace />;
  }

  const onSubmit = async (formData: RegisterFormData) => {
    // Reset error state
    setError(null);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Please ensure both passwords are the same.");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone
      );
      
      if (result.session) {
        toast({
          title: "Registration successful",
          description: "Welcome to Unihealth! You are now signed in.",
        });
        navigate("/patient-dashboard");
      } else {
        // Even if auto-login failed, the account was created
        toast({
          title: "Account created successfully",
          description: "Please sign in with your credentials.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      let errorMessage = error.message || "An error occurred during registration.";
      
      // Handle common Supabase error messages with more user-friendly messages
      if (errorMessage.includes("already registered")) {
        errorMessage = "This email is already registered. Please use another email or sign in.";
      } else if (errorMessage.includes("password")) {
        errorMessage = "Password error: Please use a stronger password with at least 8 characters.";
      }
      
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Hospital className="h-12 w-12 text-healthcare-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Unihealth</h2>
          <p className="mt-2 text-sm text-gray-600">Create your patient account</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserRound className="h-5 w-5 text-healthcare-primary" />
              <CardTitle>Patient Registration</CardTitle>
            </div>
            <CardDescription>
              Fill in your details to create a new patient account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    {...register("firstName", { required: true })}
                    aria-invalid={errors.firstName ? "true" : "false"}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">First name is required</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    {...register("lastName", { required: true })}
                    aria-invalid={errors.lastName ? "true" : "false"}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">Last name is required</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  {...register("email", { 
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.type === "required" ? "Email is required" : "Valid email is required"}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  {...register("phone", { required: true })}
                  aria-invalid={errors.phone ? "true" : "false"}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">Phone number is required</p>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  {...register("password", { 
                    required: true,
                    minLength: 8
                  })}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.type === "required" 
                      ? "Password is required" 
                      : "Password must be at least 8 characters"
                    }
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  {...register("confirmPassword", { 
                    required: true,
                    validate: value => value === watch("password") || "Passwords do not match"
                  })}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.type === "required" 
                      ? "Please confirm your password" 
                      : "Passwords do not match"
                    }
                  </p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-healthcare-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-4">
          <Link to="/" className="text-healthcare-primary hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
