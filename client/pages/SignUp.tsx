import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  Upload,
  IdCard,
  UserCheck,
} from "lucide-react";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;

  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Professional (for clinicians)
  licenseNumber: string;
  specialty: string;
  organization: string;
  npiNumber: string;

  // Security
  password: string;
  confirmPassword: string;

  // Consents
  termsAccepted: boolean;
  privacyAccepted: boolean;
  hipaaAccepted: boolean;
  marketingAccepted: boolean;
}

export default function SignUp() {
  const [userType, setUserType] = useState<
    "patient" | "clinician" | "organization"
  >("patient");
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    licenseNumber: "",
    specialty: "",
    organization: "",
    npiNumber: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    privacyAccepted: false,
    hipaaAccepted: false,
    marketingAccepted: false,
  });

  const totalSteps = userType === "patient" ? 4 : 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to verification page or success page
      window.location.href = "/verify-account";
    }, 3000);
  };

  const userTypeConfig = {
    patient: {
      icon: Heart,
      title: "Patient Registration",
      description: "Create your personal health account",
      color: "from-health-primary to-health-secondary",
      features: [
        "Access Medical Records",
        "Manage Consents",
        "Family Sharing",
        "Health Analytics",
      ],
    },
    clinician: {
      icon: Stethoscope,
      title: "Clinician Registration",
      description: "Join as a healthcare provider",
      color: "from-blue-500 to-blue-600",
      features: [
        "Patient Management",
        "Clinical Workflows",
        "E-Prescribe",
        "ICU Monitoring",
      ],
    },
    organization: {
      icon: Building2,
      title: "Organization Registration",
      description: "Register your healthcare facility",
      color: "from-purple-500 to-purple-600",
      features: [
        "Multi-Provider Access",
        "Administrative Tools",
        "Compliance Reporting",
        "System Integration",
      ],
    },
  };

  const currentConfig = userTypeConfig[userType];
  const IconComponent = currentConfig.icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-gray-600">
                Let's start with your basic details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="john.doe@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      updateFormData("dateOfBirth", e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => updateFormData("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <p className="text-sm text-gray-600">
                We need your address for identity verification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="123 Main Street"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => updateFormData("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="al">Alabama</SelectItem>
                    <SelectItem value="ak">Alaska</SelectItem>
                    <SelectItem value="az">Arizona</SelectItem>
                    <SelectItem value="ar">Arkansas</SelectItem>
                    <SelectItem value="ca">California</SelectItem>
                    <SelectItem value="co">Colorado</SelectItem>
                    <SelectItem value="ct">Connecticut</SelectItem>
                    <SelectItem value="de">Delaware</SelectItem>
                    <SelectItem value="fl">Florida</SelectItem>
                    <SelectItem value="ga">Georgia</SelectItem>
                    <SelectItem value="hi">Hawaii</SelectItem>
                    <SelectItem value="id">Idaho</SelectItem>
                    <SelectItem value="il">Illinois</SelectItem>
                    <SelectItem value="in">Indiana</SelectItem>
                    <SelectItem value="ia">Iowa</SelectItem>
                    <SelectItem value="ks">Kansas</SelectItem>
                    <SelectItem value="ky">Kentucky</SelectItem>
                    <SelectItem value="la">Louisiana</SelectItem>
                    <SelectItem value="me">Maine</SelectItem>
                    <SelectItem value="md">Maryland</SelectItem>
                    <SelectItem value="ma">Massachusetts</SelectItem>
                    <SelectItem value="mi">Michigan</SelectItem>
                    <SelectItem value="mn">Minnesota</SelectItem>
                    <SelectItem value="ms">Mississippi</SelectItem>
                    <SelectItem value="mo">Missouri</SelectItem>
                    <SelectItem value="mt">Montana</SelectItem>
                    <SelectItem value="ne">Nebraska</SelectItem>
                    <SelectItem value="nv">Nevada</SelectItem>
                    <SelectItem value="nh">New Hampshire</SelectItem>
                    <SelectItem value="nj">New Jersey</SelectItem>
                    <SelectItem value="nm">New Mexico</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="nc">North Carolina</SelectItem>
                    <SelectItem value="nd">North Dakota</SelectItem>
                    <SelectItem value="oh">Ohio</SelectItem>
                    <SelectItem value="ok">Oklahoma</SelectItem>
                    <SelectItem value="or">Oregon</SelectItem>
                    <SelectItem value="pa">Pennsylvania</SelectItem>
                    <SelectItem value="ri">Rhode Island</SelectItem>
                    <SelectItem value="sc">South Carolina</SelectItem>
                    <SelectItem value="sd">South Dakota</SelectItem>
                    <SelectItem value="tn">Tennessee</SelectItem>
                    <SelectItem value="tx">Texas</SelectItem>
                    <SelectItem value="ut">Utah</SelectItem>
                    <SelectItem value="vt">Vermont</SelectItem>
                    <SelectItem value="va">Virginia</SelectItem>
                    <SelectItem value="wa">Washington</SelectItem>
                    <SelectItem value="wv">West Virginia</SelectItem>
                    <SelectItem value="wi">Wisconsin</SelectItem>
                    <SelectItem value="wy">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => updateFormData("zipCode", e.target.value)}
                placeholder="10001"
                required
              />
            </div>
          </div>
        );

      case 3:
        if (userType === "clinician" || userType === "organization") {
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">
                  Professional Information
                </h3>
                <p className="text-sm text-gray-600">
                  Verify your healthcare credentials
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      updateFormData("licenseNumber", e.target.value)
                    }
                    placeholder="MD12345678"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="npiNumber">NPI Number</Label>
                <Input
                  id="npiNumber"
                  value={formData.npiNumber}
                  onChange={(e) => updateFormData("npiNumber", e.target.value)}
                  placeholder="1234567890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Medical Specialty</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => updateFormData("specialty", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="endocrinology">Endocrinology</SelectItem>
                    <SelectItem value="family-medicine">
                      Family Medicine
                    </SelectItem>
                    <SelectItem value="internal-medicine">
                      Internal Medicine
                    </SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="radiology">Radiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Healthcare Organization</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      updateFormData("organization", e.target.value)
                    }
                    placeholder="Metro General Hospital"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">Credential Verification</p>
                    <p>
                      Your medical license will be verified through state
                      medical boards before account activation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        // Fall through to security step for patients
        return renderSecurityStep();

      case 4:
        return renderSecurityStep();

      case 5:
        return renderConsentStep();

      default:
        return null;
    }
  };

  const renderSecurityStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Security Setup</h3>
        <p className="text-sm text-gray-600">
          Create a secure password for your account
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="Create a strong password"
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            placeholder="Confirm your password"
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">
          Password Requirements:
        </p>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
            At least 8 characters
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
            One uppercase letter
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
            One number
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
            One special character
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Setup */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">
              Two-Factor Authentication
            </p>
            <p className="text-sm text-blue-700 mb-3">
              Enhance your account security with 2FA. You'll set this up after
              registration.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300"
              >
                <Fingerprint className="w-3 h-3 mr-1" />
                Biometric
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-700 border-blue-300"
              >
                <Smartphone className="w-3 h-3 mr-1" />
                Authenticator App
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsentStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Terms & Consent</h3>
        <p className="text-sm text-gray-600">
          Review and accept our terms to complete registration
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) =>
              updateFormData("termsAccepted", checked)
            }
            required
          />
          <div className="flex-1">
            <Label htmlFor="terms" className="font-medium">
              Terms of Service
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              I agree to the{" "}
              <Link to="/terms" className="text-health-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and understand my rights and responsibilities.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="privacy"
            checked={formData.privacyAccepted}
            onCheckedChange={(checked) =>
              updateFormData("privacyAccepted", checked)
            }
            required
          />
          <div className="flex-1">
            <Label htmlFor="privacy" className="font-medium">
              Privacy Policy
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              I have read and agree to the{" "}
              <Link
                to="/privacy"
                className="text-health-primary hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and data handling practices.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg bg-blue-50 border-blue-200">
          <Checkbox
            id="hipaa"
            checked={formData.hipaaAccepted}
            onCheckedChange={(checked) =>
              updateFormData("hipaaAccepted", checked)
            }
            required
          />
          <div className="flex-1">
            <Label htmlFor="hipaa" className="font-medium text-blue-900">
              HIPAA Authorization
            </Label>
            <p className="text-sm text-blue-700 mt-1">
              I authorize the use and disclosure of my protected health
              information as described in the{" "}
              <Link to="/hipaa" className="text-blue-600 hover:underline">
                HIPAA Notice
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="marketing"
            checked={formData.marketingAccepted}
            onCheckedChange={(checked) =>
              updateFormData("marketingAccepted", checked)
            }
          />
          <div className="flex-1">
            <Label htmlFor="marketing" className="font-medium">
              Marketing Communications
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              I consent to receive health tips, platform updates, and
              promotional content via email. You can unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start space-x-2">
          <Shield className="w-4 h-4 text-green-600 mt-0.5" />
          <div className="text-sm text-green-700">
            <p className="font-medium">Blockchain Consent Recording</p>
            <p>
              Your consent will be cryptographically secured and recorded on our
              permissioned blockchain for immutable audit trails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-blue-50">
      {/* Background Pattern */}
      <div
        className={
          'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-50'
        }
      />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-health-primary to-health-secondary rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthChain</h1>
                <p className="text-xs text-medical-600">Episode-Centric Care</p>
              </div>
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              Join the future of healthcare data management
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              {/* User Type Selection */}
              <Tabs
                value={userType}
                onValueChange={(value) => setUserType(value as any)}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="patient">Patient</TabsTrigger>
                  <TabsTrigger value="clinician">Clinician</TabsTrigger>
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                </TabsList>

                {Object.entries(userTypeConfig).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <TabsContent key={type} value={type} className="mt-4">
                      <div
                        className={`p-4 bg-gradient-to-r ${config.color} rounded-lg text-white`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="w-6 h-6" />
                          <div>
                            <h3 className="font-semibold">{config.title}</h3>
                            <p className="text-sm opacity-90">
                              {config.description}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {config.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs"
                            >
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

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={
                  currentStep === totalSteps
                    ? handleSubmit
                    : (e) => e.preventDefault()
                }
              >
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setCurrentStep((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentStep === 1}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep === totalSteps ? (
                    <Button
                      type="submit"
                      className={`bg-gradient-to-r ${currentConfig.color} hover:opacity-90`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-2" />
                          Create Account
                        </div>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() =>
                        setCurrentStep((prev) => Math.min(totalSteps, prev + 1))
                      }
                      className={`bg-gradient-to-r ${currentConfig.color} hover:opacity-90`}
                    >
                      <div className="flex items-center">
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </Button>
                  )}
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-health-primary hover:underline font-medium"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
