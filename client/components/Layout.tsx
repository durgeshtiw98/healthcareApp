import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Heart,
  User,
  Stethoscope,
  FileText,
  Shield,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Heart },
    { name: "Patient Portal", href: "/patient", icon: User },
    { name: "Clinician Portal", href: "/clinician", icon: Stethoscope },
    { name: "Episodes", href: "/episodes", icon: FileText },
    { name: "Consents", href: "/consents", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-medical-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-health-primary to-health-secondary rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-health-success rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthChain</h1>
                <p className="text-xs text-medical-600">Episode-Centric Care</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-health-primary text-white"
                        : "text-gray-600 hover:text-health-primary hover:bg-medical-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-health-critical text-white text-xs p-0 flex items-center justify-center">
                  3
                </Badge>
              </Button>

              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-health-primary hover:bg-health-primary/90"
                  asChild
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-medical-200">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-health-primary text-white"
                        : "text-gray-600 hover:text-health-primary hover:bg-medical-100"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-medical-200 space-y-1">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-health-primary hover:bg-health-primary/90"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-medical-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-health-primary to-health-secondary rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">
                  HealthChain
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Episode-centric healthcare platform with patient-controlled
                access, FHIR compliance, and blockchain-secured consent
                management.
              </p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>HIPAA Compliant</span>
                <span>FHIR R4</span>
                <span>Blockchain Secured</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Patients</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/patient" className="hover:text-health-primary">
                    My Episodes
                  </Link>
                </li>
                <li>
                  <Link to="/consents" className="hover:text-health-primary">
                    Manage Consents
                  </Link>
                </li>
                <li>
                  <Link to="/patient" className="hover:text-health-primary">
                    Health Records
                  </Link>
                </li>
                <li>
                  <Link to="/patient" className="hover:text-health-primary">
                    Share Data
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                For Clinicians
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link to="/clinician" className="hover:text-health-primary">
                    Patient Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/clinician" className="hover:text-health-primary">
                    ICU Monitoring
                  </Link>
                </li>
                <li>
                  <Link to="/clinician" className="hover:text-health-primary">
                    E-Prescribe
                  </Link>
                </li>
                <li>
                  <Link to="/clinician" className="hover:text-health-primary">
                    Lab Orders
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-medical-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 HealthChain. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  to="/privacy"
                  className="text-sm text-gray-500 hover:text-health-primary"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-sm text-gray-500 hover:text-health-primary"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/security"
                  className="text-sm text-gray-500 hover:text-health-primary"
                >
                  Security
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
