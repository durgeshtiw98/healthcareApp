import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Shield,
  Eye,
  EyeOff,
  Lock,
  User,
  Stethoscope,
  Heart,
  Fingerprint,
  Smartphone,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Building2,
  UserCheck
} from "lucide-react";

export default function SignIn() {
  const [userType, setUserType] = useState<"patient" | "clinician" | "admin">("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      setTwoFactorStep(true);
    }, 2000);
  };

  const handleTwoFactorVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate 2FA verification
    setTimeout(() => {
      setIsLoading(false);
      // Redirect based on user type
      if (userType === "patient") {
        window.location.href = "/patient";
      } else if (userType === "clinician") {
        window.location.href = "/clinician";
      } else {
        window.location.href = "/admin";
      }
    }, 1500);
  };

  const userTypeConfig = {
    patient: {
      icon: Heart,
      title: "Patient Portal",
      description: "Access your health records and manage consents",
      color: "from-health-primary to-health-secondary",
      features: ["View Episodes", "Manage Consents", "Health Analytics", "Family Sharing"]
    },
    clinician: {
      icon: Stethoscope,
      title: "Clinician Portal", 
      description: "Manage patient care and clinical workflows",
      color: "from-blue-500 to-blue-600",
      features: ["Patient Management", "Episode Tracking", "ICU Monitoring", "E-Prescribe"]
    },
    admin: {
      icon: Building2,
      title: "Admin Portal",
      description: "System administration and healthcare operations",
      color: "from-purple-500 to-purple-600", 
      features: ["User Management", "System Analytics", "Compliance Reports", "Blockchain Audit"]
    }
  };

  const currentConfig = userTypeConfig[userType];
  const IconComponent = currentConfig.icon;

  if (twoFactorStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23059669\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"} />
        
        <Card className="w-full max-w-md relative">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${currentConfig.color} rounded-2xl flex items-center justify-center`}>
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app or SMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTwoFactorVerification} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <button type="button" className="text-health-primary hover:underline">
                  Resend Code
                </button>
                <button type="button" className="text-health-primary hover:underline">
                  Use Backup Code
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-health-primary hover:bg-health-primary/90"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => setTwoFactorStep(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23059669\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"} />
      
      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-health-primary to-health-secondary rounded-xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HealthChain</h1>
                <p className="text-sm text-medical-600">Episode-Centric Care</p>
              </div>
            </Link>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Secure Healthcare
              <span className="block bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent">
                Authentication
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Access your episode-centric healthcare platform with enterprise-grade security, 
              blockchain verification, and patient-controlled access management.
            </p>

            {/* Security Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg border border-medical-200">
                <Shield className="w-6 h-6 text-health-primary" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Blockchain Secured</p>
                  <p className="text-sm text-gray-600">Immutable audit trails</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg border border-medical-200">
                <Fingerprint className="w-6 h-6 text-health-primary" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Multi-Factor Auth</p>
                  <p className="text-sm text-gray-600">Biometric verification</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg border border-medical-200">
                <Lock className="w-6 h-6 text-health-primary" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">HIPAA Compliant</p>
                  <p className="text-sm text-gray-600">End-to-end encryption</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/70 rounded-lg border border-medical-200">
                <UserCheck className="w-6 h-6 text-health-primary" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Role-Based Access</p>
                  <p className="text-sm text-gray-600">Granular permissions</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                SOC 2 Certified
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                99.9% Uptime SLA
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                24/7 Security Monitoring
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <CardDescription>
                  Choose your portal and sign in to access your healthcare platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* User Type Selection */}
                <Tabs value={userType} onValueChange={(value) => setUserType(value as any)} className="mb-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="patient" className="text-xs">Patient</TabsTrigger>
                    <TabsTrigger value="clinician" className="text-xs">Clinician</TabsTrigger>
                    <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
                  </TabsList>

                  {Object.entries(userTypeConfig).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <TabsContent key={type} value={type} className="mt-4">
                        <div className={`p-4 bg-gradient-to-r ${config.color} rounded-lg text-white mb-4`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <Icon className="w-6 h-6" />
                            <div>
                              <h3 className="font-semibold">{config.title}</h3>
                              <p className="text-sm opacity-90">{config.description}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {config.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-me" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-health-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full bg-gradient-to-r ${currentConfig.color} hover:opacity-90`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <IconComponent className="w-4 h-4 mr-2" />
                        Sign In to {currentConfig.title}
                      </div>
                    )}
                  </Button>
                </form>

                {/* Additional Security Options */}
                <div className="mt-6 space-y-3">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">
                      <Fingerprint className="w-4 h-4 mr-2" />
                      Biometric
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Smartphone className="w-4 h-4 mr-2" />
                      Mobile App
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-health-primary hover:underline font-medium">
                      Create Account
                    </Link>
                  </p>
                </div>

                {/* Security Notice */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-xs text-blue-700">
                      <p className="font-medium">Secure Session</p>
                      <p>Your session is encrypted and monitored for security. All access is logged for compliance.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
