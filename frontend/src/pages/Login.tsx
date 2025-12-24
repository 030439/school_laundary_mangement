import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${res.data.user.name}!`,
        variant: "default",
      });

      navigate("/");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 shadow-lg">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">School Management</h1>
          <p className="text-gray-500 mt-1">Boarding School Admin Portal</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border border-gray-200 rounded-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-6">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <button type="button" className="text-blue-500 hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-gray-100 rounded-lg text-center text-gray-500 text-sm">
              <p>
                <strong>Demo:</strong> Use any email/password to access
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-400 mt-6">
          © 2024 School Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
