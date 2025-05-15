
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Hospital, UserRound } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "admin">("patient");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This is where we would authenticate with Supabase
      // For now, we'll simulate login with a timeout
      setTimeout(() => {
        // Simulate successful login based on role
        if (role === "patient") {
          navigate("/patient-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
        
        toast({
          title: "Login successful",
          description: `Logged in as ${role}`,
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">UniHealth</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Choose your account type and enter your credentials
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="patient" onValueChange={(value) => setRole(value as "patient" | "admin")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" className="flex items-center justify-center">
                <UserRound className="mr-2 h-4 w-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center justify-center">
                <Hospital className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="patient">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input 
                      id="patient-email" 
                      type="email" 
                      placeholder="patient@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="patient-password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-healthcare-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="patient-password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in as Patient"}
                  </Button>
                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-healthcare-primary hover:underline">
                      Register here
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email" 
                      placeholder="admin@hospital.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="admin-password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-healthcare-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="admin-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in as Admin"}
                  </Button>
                  <div className="text-center text-sm">
                    Hospital registration requires approval.{" "}
                    <Link to="/contact" className="text-healthcare-primary hover:underline">
                      Contact us
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
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

export default Login;
