import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Calendar,
  FileText,
  Heart,
  Shield,
  Bell,
  Download,
  Share,
  Plus,
  Clock,
  User,
  Stethoscope,
  TestTube,
  Pill,
  Camera,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  Unlock,
  ExternalLink
} from "lucide-react";

interface Episode {
  id: string;
  title: string;
  diagnosis: string;
  status: "active" | "completed" | "suspended";
  startDate: string;
  endDate?: string;
  provider: string;
  facility: string;
  severity: "low" | "medium" | "high" | "critical";
  lastActivity: string;
  artifacts: number;
  consents: number;
}

interface Consent {
  id: string;
  scope: string;
  grantedTo: string;
  purpose: string;
  expires: string;
  status: "active" | "expired" | "revoked";
  permissions: string[];
}

export default function PatientDashboard() {
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);

  const episodes: Episode[] = [
    {
      id: "EP-2024-001",
      title: "Chronic Diabetes Management",
      diagnosis: "Type 2 Diabetes Mellitus",
      status: "active",
      startDate: "2024-01-15",
      provider: "Dr. Sarah Johnson",
      facility: "Metro Health Center",
      severity: "medium",
      lastActivity: "2 hours ago",
      artifacts: 24,
      consents: 3
    },
    {
      id: "EP-2024-002",
      title: "Hypertension Monitoring",
      diagnosis: "Essential Hypertension",
      status: "active",
      startDate: "2024-02-20",
      provider: "Dr. Michael Chen",
      facility: "Metro Health Center",
      severity: "low",
      lastActivity: "1 day ago",
      artifacts: 12,
      consents: 2
    },
    {
      id: "EP-2023-045",
      title: "Annual Physical Examination",
      diagnosis: "Routine Health Maintenance",
      status: "completed",
      startDate: "2023-12-10",
      endDate: "2023-12-15",
      provider: "Dr. Emily Davis",
      facility: "Primary Care Associates",
      severity: "low",
      lastActivity: "3 months ago",
      artifacts: 8,
      consents: 1
    }
  ];

  const consents: Consent[] = [
    {
      id: "C-001",
      scope: "Emergency Access",
      grantedTo: "Emergency Department",
      purpose: "Emergency medical treatment",
      expires: "2024-12-31",
      status: "active",
      permissions: ["vitals", "allergies", "current_medications", "medical_history"]
    },
    {
      id: "C-002",
      scope: "Treating Clinician",
      grantedTo: "Dr. Sarah Johnson",
      purpose: "Diabetes management and treatment",
      expires: "2024-06-15",
      status: "active",
      permissions: ["full_episode_access", "read_write_notes", "order_labs", "prescribe_medications"]
    },
    {
      id: "C-003",
      scope: "Lab Results",
      grantedTo: "Quest Diagnostics",
      purpose: "Laboratory testing and reporting",
      expires: "2024-04-30",
      status: "active",
      permissions: ["read_orders", "write_results", "upload_reports"]
    },
    {
      id: "C-004",
      scope: "Family Dashboard",
      grantedTo: "Jane Doe (Spouse)",
      purpose: "Health monitoring and updates",
      expires: "2025-01-01",
      status: "active",
      permissions: ["read_vitals", "read_appointments", "emergency_notifications"]
    }
  ];

  const recentActivity = [
    {
      type: "vitals",
      title: "Blood glucose reading uploaded",
      time: "2 hours ago",
      icon: Activity,
      color: "text-green-600"
    },
    {
      type: "lab",
      title: "Lab results available - HbA1c",
      time: "1 day ago",
      icon: TestTube,
      color: "text-blue-600"
    },
    {
      type: "prescription",
      title: "Metformin prescription refilled",
      time: "3 days ago",
      icon: Pill,
      color: "text-purple-600"
    },
    {
      type: "appointment",
      title: "Appointment scheduled with Dr. Johnson",
      time: "5 days ago",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      case "revoked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your health episodes and consents</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share Records
            </Button>
            <Button size="sm" className="bg-health-primary hover:bg-health-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Episode
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Episodes</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                </div>
                <div className="w-12 h-12 bg-health-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-health-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Consents</p>
                  <p className="text-3xl font-bold text-gray-900">4</p>
                </div>
                <div className="w-12 h-12 bg-health-secondary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-health-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-3xl font-bold text-gray-900">85</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Appointment</p>
                  <p className="text-lg font-bold text-gray-900">Tomorrow</p>
                  <p className="text-sm text-gray-500">2:00 PM</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="episodes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="consents">Consents</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Episodes Tab */}
          <TabsContent value="episodes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {episodes.map((episode) => (
                <Card key={episode.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {episode.id}
                          </Badge>
                          <Badge className={getStatusColor(episode.status)}>
                            {episode.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{episode.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {episode.diagnosis}
                        </CardDescription>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(episode.severity)}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        {episode.provider}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        {episode.facility}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Started {episode.startDate}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{episode.artifacts}</div>
                          <div className="text-xs text-gray-600">Artifacts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{episode.consents}</div>
                          <div className="text-xs text-gray-600">Consents</div>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Consents Tab */}
          <TabsContent value="consents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consents.map((consent) => (
                <Card key={consent.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{consent.scope}</CardTitle>
                        <CardDescription className="mt-1">
                          Granted to {consent.grantedTo}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(consent.status)}>
                        {consent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Purpose</p>
                        <p className="text-sm text-gray-600">{consent.purpose}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Permissions</p>
                        <div className="space-y-1">
                          {consent.permissions.map((permission, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                              {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-gray-600">Expires</p>
                          <p className="text-sm font-medium">{consent.expires}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Lock className="w-3 h-3 mr-1" />
                            Modify
                          </Button>
                          <Button variant="destructive" size="sm">
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates across your healthcare episodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center ${activity.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.time}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Trends</CardTitle>
                  <CardDescription>
                    Your health metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Blood Glucose Control</span>
                        <span className="text-sm text-green-600">Improving</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Blood Pressure Management</span>
                        <span className="text-sm text-blue-600">Stable</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Medication Adherence</span>
                        <span className="text-sm text-green-600">Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Actions</CardTitle>
                  <CardDescription>
                    Recommended next steps for your care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Lab Work Due</p>
                        <p className="text-sm text-blue-700">Schedule your quarterly HbA1c test</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Prescription Refill</p>
                        <p className="text-sm text-yellow-700">Metformin expires in 5 days</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">Great Progress!</p>
                        <p className="text-sm text-green-700">Your glucose levels are trending well</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
