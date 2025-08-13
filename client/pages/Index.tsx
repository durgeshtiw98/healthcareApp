import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import {
  Activity,
  Shield,
  Database,
  Zap,
  Users,
  Stethoscope,
  FileText,
  Heart,
  Bell,
  ChartBar,
  Lock,
  Smartphone,
  Monitor,
  Pill,
  TestTube,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: FileText,
      title: "Episode-Centric Care",
      description:
        "One diagnosis = one episode repository. All visits, artifacts, and data organized by medical episodes for comprehensive care tracking.",
      color: "bg-blue-500",
    },
    {
      icon: Shield,
      title: "Patient-Controlled Access",
      description:
        "Granular consent management with blockchain security. Patients control who accesses what data, for how long, and why.",
      color: "bg-green-500",
    },
    {
      icon: Database,
      title: "FHIR R4 Compliant",
      description:
        "Standards-first approach with FHIR R4 for clinical data, DICOM for imaging, and HL7 v2 for legacy system integration.",
      color: "bg-purple-500",
    },
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      description:
        "ICU-grade real-time streams via IoT devices with intelligent alert systems and predictive analytics.",
      color: "bg-red-500",
    },
  ];

  const workflows = [
    {
      title: "Critical & ICU Care",
      description:
        "Real-time monitoring with automated alerts and family notifications",
      icon: Heart,
      features: [
        "24/7 Monitoring",
        "Automated Alerts",
        "Family Updates",
        "Predictive Analytics",
      ],
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Chronic Care Management",
      description: "Long-term condition tracking with personalized care plans",
      icon: Activity,
      features: [
        "Care Plans",
        "Home Monitoring",
        "Trend Analysis",
        "Risk Scoring",
      ],
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Lab & Diagnostics",
      description: "Seamless lab ordering, result delivery, and DICOM imaging",
      icon: TestTube,
      features: [
        "E-Orders",
        "Result Notifications",
        "DICOM Integration",
        "Report Generation",
      ],
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Pharmacy Integration",
      description: "E-prescribing with verification and dispensing tracking",
      icon: Pill,
      features: [
        "E-Prescribe",
        "Drug Verification",
        "Dispensing Alerts",
        "Interaction Checks",
      ],
      color: "from-purple-500 to-violet-600",
    },
  ];

  const stats = [
    { label: "Episodes Managed", value: "10M+", icon: FileText },
    { label: "Healthcare Providers", value: "5,000+", icon: Stethoscope },
    { label: "Patient Records", value: "50M+", icon: Users },
    { label: "Uptime", value: "99.9%", icon: CheckCircle },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-medical-50 via-white to-blue-50">
          <div
            className={
              'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23059669" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-50'
            }
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-health-primary/10 text-health-primary border-health-primary/20">
                <Activity className="w-3 h-3 mr-1" />
                Episode-Centric Healthcare Platform
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Healthcare Data,{" "}
                <span className="bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent">
                  Reimagined
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The first episode-centric healthcare platform with
                patient-controlled access, FHIR compliance, and
                blockchain-secured consent management. One diagnosis, one
                repository, complete control.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-health-primary hover:bg-health-primary/90 text-lg px-8"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Patient Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Clinician Access
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  FHIR R4 Standard
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Blockchain Secured
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Dashboard Preview */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-medical-200 overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="bg-gradient-to-r from-health-primary to-health-secondary p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white/30 rounded-full" />
                      <div className="w-3 h-3 bg-white/30 rounded-full" />
                      <div className="w-3 h-3 bg-white/30 rounded-full" />
                    </div>
                    <div className="text-white text-sm font-medium">
                      Episode #HC-2024-001
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Chronic Diabetes Management
                    </h3>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-medical-50 p-3 rounded-lg">
                      <div className="text-sm text-medical-600">
                        Latest Glucose
                      </div>
                      <div className="text-lg font-semibold text-medical-900">
                        125 mg/dL
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-600">
                        Next Appointment
                      </div>
                      <div className="text-lg font-semibold text-blue-900">
                        Tomorrow
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Activity className="w-4 h-4 text-green-500 mr-2" />
                      Recent vitals uploaded
                    </div>
                    <div className="flex items-center text-sm">
                      <TestTube className="w-4 h-4 text-blue-500 mr-2" />
                      Lab results pending
                    </div>
                    <div className="flex items-center text-sm">
                      <Pill className="w-4 h-4 text-purple-500 mr-2" />
                      Prescription refilled
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-medical-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-gray-600">
                    Real-time monitoring
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-medical-200">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-health-primary" />
                  <span className="text-xs font-medium text-gray-600">
                    Blockchain secured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-health-primary to-health-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-medical-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-health-primary/10 text-health-primary border-health-primary/20">
              Core Principles
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built on Four Foundational Pillars
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform revolutionizes healthcare data management through
              episode-centric design, patient empowerment, standards compliance,
              and cutting-edge security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 ${feature.color}`}
                  />
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflows Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-health-secondary/10 text-health-secondary border-health-secondary/20">
              Care Workflows
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Care Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From critical ICU monitoring to chronic disease management, our
              platform supports every aspect of modern healthcare delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {workflows.map((workflow, index) => {
              const Icon = workflow.icon;
              return (
                <Card
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${workflow.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                  />
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${workflow.color} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-gray-900 transition-colors">
                          {workflow.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {workflow.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {workflow.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full mt-4 group-hover:bg-white/50 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-white/10 text-white border-white/20">
                <Shield className="w-3 h-3 mr-1" />
                Security & Privacy
              </Badge>

              <h2 className="text-4xl font-bold text-white mb-6">
                Your Data, Your Control
              </h2>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Built with privacy-first architecture. Medical data stays
                off-chain while consent and audit trails are secured on a
                permissioned blockchain.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "AES-256 encryption at rest and in transit",
                  "Field-level encryption for sensitive data",
                  "Zero-trust security architecture",
                  "Immutable audit trails on blockchain",
                  "Granular consent management",
                  "GDPR and HIPAA compliance",
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                View Security Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Consent Management
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      scope: "Emergency Access",
                      status: "Active",
                      expires: "24h",
                      color: "red",
                    },
                    {
                      scope: "Treating Clinician",
                      status: "Active",
                      expires: "90d",
                      color: "green",
                    },
                    {
                      scope: "Lab Results",
                      status: "Pending",
                      expires: "30d",
                      color: "yellow",
                    },
                    {
                      scope: "Family Dashboard",
                      status: "Active",
                      expires: "1y",
                      color: "blue",
                    },
                  ].map((consent, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full bg-${consent.color}-500`}
                        />
                        <span className="text-white text-sm font-medium">
                          {consent.scope}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-300">
                          {consent.status}
                        </div>
                        <div className="text-xs text-gray-400">
                          Expires {consent.expires}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-health-primary to-health-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join thousands of healthcare providers and patients already using
            our episode-centric platform for better, more secure care
            management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-health-primary hover:bg-gray-50 border-white"
            >
              <Users className="w-5 h-5 mr-2" />
              Patient Sign Up
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              <Stethoscope className="w-5 h-5 mr-2" />
              Provider Demo
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free Setup
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              24/7 Support
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
