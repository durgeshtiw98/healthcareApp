import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
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
  ExternalLink,
  Edit,
  UserCheck,
  X,
  Settings,
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

interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const availablePermissions = [
  "vitals",
  "allergies",
  "current_medications",
  "medical_history",
  "full_episode_access",
  "read_write_notes",
  "order_labs",
  "prescribe_medications",
  "read_orders",
  "write_results",
  "upload_reports",
  "read_vitals",
  "read_appointments",
  "emergency_notifications",
  "view_lab_results",
  "modify_treatment_plan",
  "discharge_planning",
  "billing_access",
  "insurance_verification"
];

const permissionTemplates: PermissionTemplate[] = [
  {
    id: "emergency",
    name: "Emergency Access",
    description: "Essential permissions for emergency situations",
    permissions: ["vitals", "allergies", "current_medications", "medical_history"]
  },
  {
    id: "treating_physician",
    name: "Treating Physician",
    description: "Full access for primary care providers",
    permissions: ["full_episode_access", "read_write_notes", "order_labs", "prescribe_medications", "modify_treatment_plan"]
  },
  {
    id: "specialist",
    name: "Specialist Consultation",
    description: "Limited access for specialist consultations",
    permissions: ["read_vitals", "view_lab_results", "read_write_notes", "order_labs"]
  },
  {
    id: "family_member",
    name: "Family/Caregiver",
    description: "Basic monitoring access for family members",
    permissions: ["read_vitals", "read_appointments", "emergency_notifications"]
  },
  {
    id: "lab_technician",
    name: "Laboratory",
    description: "Lab-specific permissions",
    permissions: ["read_orders", "write_results", "upload_reports"]
  }
];

export default function PatientDashboard() {
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [episodeDetailsDialog, setEpisodeDetailsDialog] = useState<Episode | null>(null);

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
      consents: 3,
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
      consents: 2,
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
      consents: 1,
    },
  ];

  const consents: Consent[] = [
    {
      id: "C-001",
      scope: "Emergency Access",
      grantedTo: "Emergency Department",
      purpose: "Emergency medical treatment",
      expires: "2024-12-31",
      status: "active",
      permissions: [
        "vitals",
        "allergies",
        "current_medications",
        "medical_history",
      ],
    },
    {
      id: "C-002",
      scope: "Treating Clinician",
      grantedTo: "Dr. Sarah Johnson",
      purpose: "Diabetes management and treatment",
      expires: "2024-06-15",
      status: "active",
      permissions: [
        "full_episode_access",
        "read_write_notes",
        "order_labs",
        "prescribe_medications",
      ],
    },
    {
      id: "C-003",
      scope: "Lab Results",
      grantedTo: "Quest Diagnostics",
      purpose: "Laboratory testing and reporting",
      expires: "2024-04-30",
      status: "active",
      permissions: ["read_orders", "write_results", "upload_reports"],
    },
    {
      id: "C-004",
      scope: "Family Dashboard",
      grantedTo: "Jane Doe (Spouse)",
      purpose: "Health monitoring and updates",
      expires: "2025-01-01",
      status: "active",
      permissions: [
        "read_vitals",
        "read_appointments",
        "emergency_notifications",
      ],
    },
  ];

  const recentActivity = [
    {
      type: "vitals",
      title: "Blood glucose reading uploaded",
      time: "2 hours ago",
      icon: Activity,
      color: "text-green-600",
    },
    {
      type: "lab",
      title: "Lab results available - HbA1c",
      time: "1 day ago",
      icon: TestTube,
      color: "text-blue-600",
    },
    {
      type: "prescription",
      title: "Metformin prescription refilled",
      time: "3 days ago",
      icon: Pill,
      color: "text-purple-600",
    },
    {
      type: "appointment",
      title: "Appointment scheduled with Dr. Johnson",
      time: "5 days ago",
      icon: Calendar,
      color: "text-orange-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your health episodes and consents
            </p>
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
            <Button
              size="sm"
              className="bg-health-primary hover:bg-health-primary/90"
            >
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Episodes
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Consents
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Health Score
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Next Appointment
                  </p>
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
                <Card
                  key={episode.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
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
                        <CardTitle className="text-lg">
                          {episode.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {episode.diagnosis}
                        </CardDescription>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${getSeverityColor(episode.severity)}`}
                      />
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
                          <div className="text-lg font-semibold text-gray-900">
                            {episode.artifacts}
                          </div>
                          <div className="text-xs text-gray-600">Artifacts</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {episode.consents}
                          </div>
                          <div className="text-xs text-gray-600">Consents</div>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        variant="outline"
                        size="sm"
                        onClick={() => setEpisodeDetailsDialog(episode)}
                      >
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
                        <CardTitle className="text-lg">
                          {consent.scope}
                        </CardTitle>
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
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Purpose
                        </p>
                        <p className="text-sm text-gray-600">
                          {consent.purpose}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Permissions
                        </p>
                        <div className="space-y-1">
                          {consent.permissions.map((permission, index) => (
                            <div
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                              {permission
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-gray-600">Expires</p>
                          <p className="text-sm font-medium">
                            {consent.expires}
                          </p>
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
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center ${activity.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.time}
                          </p>
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
              {/* Blood Glucose Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-health-primary" />
                    Blood Glucose Trends
                  </CardTitle>
                  <CardDescription>
                    7-day glucose level monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          {
                            day: "Mon",
                            morning: 110,
                            afternoon: 125,
                            evening: 118,
                          },
                          {
                            day: "Tue",
                            morning: 105,
                            afternoon: 130,
                            evening: 115,
                          },
                          {
                            day: "Wed",
                            morning: 115,
                            afternoon: 140,
                            evening: 125,
                          },
                          {
                            day: "Thu",
                            morning: 108,
                            afternoon: 122,
                            evening: 120,
                          },
                          {
                            day: "Fri",
                            morning: 112,
                            afternoon: 128,
                            evening: 116,
                          },
                          {
                            day: "Sat",
                            morning: 106,
                            afternoon: 135,
                            evening: 122,
                          },
                          {
                            day: "Sun",
                            morning: 109,
                            afternoon: 126,
                            evening: 118,
                          },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          domain={[80, 160]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                          labelStyle={{ color: "#374151" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="morning"
                          stroke="#0ea5e9"
                          strokeWidth={2}
                          dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }}
                          name="Morning"
                        />
                        <Line
                          type="monotone"
                          dataKey="afternoon"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                          name="Afternoon"
                        />
                        <Line
                          type="monotone"
                          dataKey="evening"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                          name="Evening"
                        />
                        <ReferenceLine
                          y={100}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          label="Target Min"
                        />
                        <ReferenceLine
                          y={140}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          label="Target Max"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Avg Morning</p>
                      <p className="text-lg font-semibold text-blue-900">
                        109 mg/dL
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-600">Avg Afternoon</p>
                      <p className="text-lg font-semibold text-yellow-900">
                        129 mg/dL
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Avg Evening</p>
                      <p className="text-lg font-semibold text-green-900">
                        119 mg/dL
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blood Pressure Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Blood Pressure Monitoring
                  </CardTitle>
                  <CardDescription>
                    Weekly blood pressure readings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { week: "Week 1", systolic: 128, diastolic: 82 },
                          { week: "Week 2", systolic: 125, diastolic: 80 },
                          { week: "Week 3", systolic: 130, diastolic: 85 },
                          { week: "Week 4", systolic: 122, diastolic: 78 },
                          { week: "Week 5", systolic: 126, diastolic: 81 },
                          { week: "Week 6", systolic: 120, diastolic: 75 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#fef2f2" />
                        <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={12}
                          domain={[60, 150]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="systolic"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#ef444420"
                          strokeWidth={2}
                          name="Systolic"
                        />
                        <Area
                          type="monotone"
                          dataKey="diastolic"
                          stackId="2"
                          stroke="#3b82f6"
                          fill="#3b82f620"
                          strokeWidth={2}
                          name="Diastolic"
                        />
                        <ReferenceLine
                          y={120}
                          stroke="#16a34a"
                          strokeDasharray="5 5"
                          label="Normal Systolic"
                        />
                        <ReferenceLine
                          y={80}
                          stroke="#16a34a"
                          strokeDasharray="5 5"
                          label="Normal Diastolic"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Blood pressure within normal range
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Score Radial Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-health-primary" />
                    Health Score Breakdown
                  </CardTitle>
                  <CardDescription>
                    Overall health metrics analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="20%"
                        outerRadius="80%"
                        data={[
                          {
                            name: "Glucose Control",
                            value: 75,
                            fill: "#0ea5e9",
                          },
                          { name: "BP Management", value: 85, fill: "#ef4444" },
                          {
                            name: "Medication Adherence",
                            value: 95,
                            fill: "#10b981",
                          },
                          { name: "Exercise", value: 65, fill: "#f59e0b" },
                          { name: "Sleep Quality", value: 80, fill: "#8b5cf6" },
                        ]}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          dataKey="value"
                          cornerRadius={4}
                          fill="#8884d8"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend
                          iconSize={8}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{
                            fontSize: "12px",
                            paddingLeft: "20px",
                          }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-3xl font-bold text-health-primary">
                      85
                    </div>
                    <p className="text-sm text-gray-600">
                      Overall Health Score
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ↑ 8 points from last month
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* HbA1c Trend and Medication Adherence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="w-5 h-5 mr-2 text-purple-500" />
                    HbA1c Trends & Medication
                  </CardTitle>
                  <CardDescription>
                    Quarterly lab results and daily medication tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* HbA1c Chart */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        HbA1c Quarterly Trends
                      </h4>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { quarter: "Q1 2023", hba1c: 8.2 },
                              { quarter: "Q2 2023", hba1c: 7.8 },
                              { quarter: "Q3 2023", hba1c: 7.4 },
                              { quarter: "Q4 2023", hba1c: 7.1 },
                              { quarter: "Q1 2024", hba1c: 6.9 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#f3f4f6"
                            />
                            <XAxis
                              dataKey="quarter"
                              stroke="#6b7280"
                              fontSize={10}
                            />
                            <YAxis
                              stroke="#6b7280"
                              fontSize={10}
                              domain={[6, 9]}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar
                              dataKey="hba1c"
                              fill="#8b5cf6"
                              radius={[4, 4, 0, 0]}
                            />
                            <ReferenceLine
                              y={7}
                              stroke="#16a34a"
                              strokeDasharray="5 5"
                              label="Target"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Medication Adherence */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        This Week's Medication Adherence
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Metformin (2x daily)
                          </span>
                          <div className="flex space-x-1">
                            {[1, 1, 1, 1, 1, 0, 1].map((taken, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  taken
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {taken ? "✓" : "○"}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Lisinopril (1x daily)
                          </span>
                          <div className="flex space-x-1">
                            {[1, 1, 1, 1, 1, 1, 1].map((taken, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  taken
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                              >
                                {taken ? "✓" : "○"}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-green-50 rounded-lg">
                        <div className="flex items-center text-sm text-green-800">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          93% adherence this week - Excellent!
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Actions and Risk Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-orange-500" />
                    Health Insights & Actions
                  </CardTitle>
                  <CardDescription>
                    AI-powered recommendations and risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <TestTube className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Lab Work Due
                        </p>
                        <p className="text-sm text-blue-700">
                          Schedule your quarterly HbA1c test
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Due in 2 weeks
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <Pill className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">
                          Prescription Refill
                        </p>
                        <p className="text-sm text-yellow-700">
                          Metformin expires in 5 days
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                        >
                          Request Refill
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">
                          Great Progress!
                        </p>
                        <p className="text-sm text-green-700">
                          Your glucose levels are trending well
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          15% improvement over 3 months
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-900">
                          Exercise Recommendation
                        </p>
                        <p className="text-sm text-purple-700">
                          Add 15 minutes of daily walking to improve glucose
                          control
                        </p>
                        <p className="text-xs text-purple-600 mt-1">
                          Predicted 8% improvement in HbA1c
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-health-primary" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>
                    Predictive health risk analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-green-900">
                            Cardiovascular Risk
                          </p>
                          <p className="text-sm text-green-700">Low (8%)</p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-yellow-900">
                            Diabetic Complications
                          </p>
                          <p className="text-sm text-yellow-700">
                            Moderate (25%)
                          </p>
                        </div>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-blue-900">
                            Medication Interactions
                          </p>
                          <p className="text-sm text-blue-700">None detected</p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 text-center">
                        Risk scores updated daily using AI analysis of your
                        health data
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Comprehensive Episode Details Dialog */}
      <Dialog open={!!episodeDetailsDialog} onOpenChange={() => setEpisodeDetailsDialog(null)}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <FileText className="w-6 h-6 mr-3 text-health-primary" />
              {episodeDetailsDialog?.title}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {episodeDetailsDialog?.diagnosis} • Episode {episodeDetailsDialog?.id} • Started {episodeDetailsDialog?.startDate}
            </DialogDescription>
          </DialogHeader>

          {episodeDetailsDialog && (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="visits">Visits</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="dietary">Dietary</TabsTrigger>
                <TabsTrigger value="consents">Consents</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Episode Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Diagnosis</label>
                        <p className="text-gray-900">{episodeDetailsDialog.diagnosis}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <Badge className={`${episodeDetailsDialog.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {episodeDetailsDialog.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Severity</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            episodeDetailsDialog.severity === 'critical' ? 'bg-red-500' :
                            episodeDetailsDialog.severity === 'high' ? 'bg-orange-500' :
                            episodeDetailsDialog.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <span className="capitalize">{episodeDetailsDialog.severity}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duration</label>
                        <p className="text-gray-900">
                          {episodeDetailsDialog.startDate} - {episodeDetailsDialog.endDate || 'Ongoing'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Stethoscope className="w-5 h-5 mr-2" />
                        Care Team
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Primary Provider</label>
                        <p className="text-gray-900">{episodeDetailsDialog.provider}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Facility</label>
                        <p className="text-gray-900">{episodeDetailsDialog.facility}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Specialty</label>
                        <p className="text-gray-900">Endocrinology</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Care Coordinator</label>
                        <p className="text-gray-900">Nurse Kelly Williams</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Episode Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-blue-50 rounded">
                          <div className="text-lg font-semibold text-blue-900">12</div>
                          <div className="text-xs text-blue-600">Visits</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-semibold text-green-900">{episodeDetailsDialog.artifacts}</div>
                          <div className="text-xs text-green-600">Artifacts</div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded">
                          <div className="text-lg font-semibold text-purple-900">8</div>
                          <div className="text-xs text-purple-600">Lab Tests</div>
                        </div>
                        <div className="p-2 bg-orange-50 rounded">
                          <div className="text-lg font-semibold text-orange-900">5</div>
                          <div className="text-xs text-orange-600">Medications</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: "2024-01-15 14:30", event: "HbA1c Lab Results", description: "HbA1c: 6.9% (Improved from 7.2%)", type: "lab", icon: TestTube },
                        { date: "2024-01-14 09:00", event: "Medication Adjustment", description: "Metformin increased to 1000mg twice daily", type: "medication", icon: Pill },
                        { date: "2024-01-12 11:15", event: "Routine Follow-up Visit", description: "Blood glucose levels reviewed, patient education provided", type: "visit", icon: Stethoscope },
                        { date: "2024-01-10 16:45", event: "Dietary Consultation", description: "Nutrition plan updated, carb counting reviewed", type: "dietary", icon: Heart }
                      ].map((activity, index) => {
                        const IconComponent = activity.icon;
                        return (
                          <div key={index} className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.type === 'lab' ? 'bg-blue-100' :
                              activity.type === 'medication' ? 'bg-purple-100' :
                              activity.type === 'visit' ? 'bg-green-100' : 'bg-orange-100'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${
                                activity.type === 'lab' ? 'text-blue-600' :
                                activity.type === 'medication' ? 'text-purple-600' :
                                activity.type === 'visit' ? 'text-green-600' : 'text-orange-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{activity.event}</h4>
                                <span className="text-sm text-gray-500">{activity.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Visits Tab */}
              <TabsContent value="visits" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    {
                      date: "2024-01-15",
                      time: "14:30",
                      type: "Follow-up",
                      provider: "Dr. Sarah Johnson",
                      location: "Metro Health Center - Room 203",
                      duration: "45 min",
                      status: "Completed",
                      notes: "Patient reports improved energy levels. Blood glucose logs reviewed. Medication compliance excellent.",
                      vitals: { bp: "128/82", hr: "72", weight: "165 lbs", temp: "98.6°F" }
                    },
                    {
                      date: "2024-01-08",
                      time: "10:00",
                      type: "Consultation",
                      provider: "Dr. Sarah Johnson",
                      location: "Metro Health Center - Room 203",
                      duration: "30 min",
                      status: "Completed",
                      notes: "Quarterly review. HbA1c results discussed. Patient education on carbohydrate counting provided.",
                      vitals: { bp: "132/85", hr: "68", weight: "167 lbs", temp: "98.4°F" }
                    },
                    {
                      date: "2024-01-22",
                      time: "09:30",
                      type: "Follow-up",
                      provider: "Dr. Sarah Johnson",
                      location: "Metro Health Center - Room 203",
                      duration: "30 min",
                      status: "Scheduled",
                      notes: "Upcoming visit to review medication effectiveness and discuss exercise plan.",
                      vitals: null
                    }
                  ].map((visit, index) => (
                    <Card key={index} className={visit.status === 'Scheduled' ? 'border-blue-200 bg-blue-50' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{visit.type} Visit</h3>
                            <p className="text-sm text-gray-600">{visit.date} at {visit.time}</p>
                          </div>
                          <Badge className={visit.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {visit.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600">Provider</label>
                            <p className="text-sm text-gray-900">{visit.provider}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">Location</label>
                            <p className="text-sm text-gray-900">{visit.location}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">Duration</label>
                            <p className="text-sm text-gray-900">{visit.duration}</p>
                          </div>
                        </div>
                        {visit.vitals && (
                          <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-gray-50 rounded">
                            <div className="text-center">
                              <div className="text-xs text-gray-600">BP</div>
                              <div className="font-medium">{visit.vitals.bp}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600">HR</div>
                              <div className="font-medium">{visit.vitals.hr}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600">Weight</div>
                              <div className="font-medium">{visit.vitals.weight}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600">Temp</div>
                              <div className="font-medium">{visit.vitals.temp}</div>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-gray-700">{visit.notes}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Medications Tab */}
              <TabsContent value="medications" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    {
                      name: "Metformin",
                      strength: "1000mg",
                      dosage: "Twice daily with meals",
                      prescribed: "2024-01-14",
                      prescriber: "Dr. Sarah Johnson",
                      status: "Active",
                      instructions: "Take with breakfast and dinner. Monitor for gastrointestinal side effects.",
                      sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
                      lastFilled: "2024-01-14",
                      nextRefill: "2024-02-14",
                      pharmacy: "Metro Pharmacy"
                    },
                    {
                      name: "Lisinopril",
                      strength: "10mg",
                      dosage: "Once daily",
                      prescribed: "2024-01-08",
                      prescriber: "Dr. Sarah Johnson",
                      status: "Active",
                      instructions: "Take at the same time each day. Monitor blood pressure.",
                      sideEffects: ["Dry cough", "Dizziness", "Hyperkalemia"],
                      lastFilled: "2024-01-08",
                      nextRefill: "2024-02-08",
                      pharmacy: "Metro Pharmacy"
                    },
                    {
                      name: "Atorvastatin",
                      strength: "20mg",
                      dosage: "Once daily at bedtime",
                      prescribed: "2023-12-15",
                      prescriber: "Dr. Sarah Johnson",
                      status: "Discontinued",
                      instructions: "Discontinued due to muscle pain. Monitor cholesterol levels.",
                      sideEffects: ["Muscle pain", "Elevated liver enzymes"],
                      lastFilled: "2023-12-15",
                      nextRefill: "N/A",
                      pharmacy: "Metro Pharmacy"
                    }
                  ].map((med, index) => (
                    <Card key={index} className={med.status === 'Discontinued' ? 'opacity-75' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{med.name} {med.strength}</h3>
                            <p className="text-sm text-gray-600">{med.dosage}</p>
                          </div>
                          <Badge className={med.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {med.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600">Prescribed By</label>
                            <p className="text-sm text-gray-900">{med.prescriber}</p>
                            <p className="text-xs text-gray-500">{med.prescribed}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">Pharmacy</label>
                            <p className="text-sm text-gray-900">{med.pharmacy}</p>
                            <p className="text-xs text-gray-500">Last filled: {med.lastFilled}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">Next Refill</label>
                            <p className="text-sm text-gray-900">{med.nextRefill}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="text-xs font-medium text-gray-600">Instructions</label>
                          <p className="text-sm text-gray-700">{med.instructions}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Potential Side Effects</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {med.sideEffects.map((effect, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Labs Tab */}
              <TabsContent value="labs" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    {
                      date: "2024-01-15",
                      orderingProvider: "Dr. Sarah Johnson",
                      lab: "Metro Lab Services",
                      status: "Completed",
                      results: [
                        { test: "HbA1c", value: "6.9%", range: "< 7.0%", status: "Normal", trend: "Improved" },
                        { test: "Fasting Glucose", value: "128 mg/dL", range: "70-100 mg/dL", status: "High", trend: "Stable" },
                        { test: "Creatinine", value: "1.0 mg/dL", range: "0.7-1.3 mg/dL", status: "Normal", trend: "Stable" },
                        { test: "eGFR", value: "85 mL/min/1.73m²", range: "> 60", status: "Normal", trend: "Stable" }
                      ]
                    },
                    {
                      date: "2024-01-08",
                      orderingProvider: "Dr. Sarah Johnson",
                      lab: "Metro Lab Services",
                      status: "Completed",
                      results: [
                        { test: "Lipid Panel", value: "Total: 195 mg/dL", range: "< 200 mg/dL", status: "Normal", trend: "Stable" },
                        { test: "LDL Cholesterol", value: "118 mg/dL", range: "< 100 mg/dL", status: "High", trend: "Improved" },
                        { test: "HDL Cholesterol", value: "45 mg/dL", range: "> 40 mg/dL", status: "Normal", trend: "Stable" },
                        { test: "Triglycerides", value: "160 mg/dL", range: "< 150 mg/dL", status: "High", trend: "Stable" }
                      ]
                    },
                    {
                      date: "2024-01-22",
                      orderingProvider: "Dr. Sarah Johnson",
                      lab: "Metro Lab Services",
                      status: "Scheduled",
                      results: [
                        { test: "Comprehensive Metabolic Panel", value: "Pending", range: "Various", status: "Pending", trend: "-" },
                        { test: "Thyroid Function", value: "Pending", range: "Various", status: "Pending", trend: "-" }
                      ]
                    }
                  ].map((labOrder, index) => (
                    <Card key={index} className={labOrder.status === 'Scheduled' ? 'border-blue-200 bg-blue-50' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">Lab Order - {labOrder.date}</h3>
                            <p className="text-sm text-gray-600">Ordered by {labOrder.orderingProvider}</p>
                          </div>
                          <Badge className={labOrder.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {labOrder.status}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <label className="text-xs font-medium text-gray-600">Laboratory</label>
                          <p className="text-sm text-gray-900">{labOrder.lab}</p>
                        </div>
                        <div className="space-y-2">
                          {labOrder.results.map((result, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 bg-gray-50 rounded">
                              <div>
                                <div className="text-xs text-gray-600">Test</div>
                                <div className="font-medium">{result.test}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Value</div>
                                <div className={`font-medium ${
                                  result.status === 'High' ? 'text-red-600' :
                                  result.status === 'Low' ? 'text-yellow-600' : 'text-green-600'
                                }`}>{result.value}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Range</div>
                                <div className="text-sm">{result.range}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Status</div>
                                <Badge className={`text-xs ${
                                  result.status === 'High' ? 'bg-red-100 text-red-800' :
                                  result.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                  result.status === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {result.status}
                                </Badge>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600">Trend</div>
                                <div className="text-sm">{result.trend}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    {
                      title: "Quarterly Diabetes Review",
                      date: "2024-01-15",
                      provider: "Dr. Sarah Johnson",
                      type: "Clinical Summary",
                      status: "Available",
                      summary: "Comprehensive review showing excellent progress in diabetes management with improved HbA1c levels.",
                      attachments: ["Quarterly_Report_Q1_2024.pdf", "Lab_Results_Summary.pdf"]
                    },
                    {
                      title: "Medication Effectiveness Analysis",
                      date: "2024-01-10",
                      provider: "PharmD Clinical Team",
                      type: "Medication Review",
                      status: "Available",
                      summary: "Analysis of current medication regimen effectiveness and recommendations for optimization.",
                      attachments: ["Medication_Analysis_Report.pdf"]
                    },
                    {
                      title: "Dietary Compliance Assessment",
                      date: "2024-01-08",
                      provider: "Nutritionist Sarah Green",
                      type: "Nutrition Report",
                      status: "Available",
                      summary: "Assessment of dietary adherence and recommendations for improved glycemic control.",
                      attachments: ["Dietary_Assessment_Jan2024.pdf", "Meal_Plan_Updated.pdf"]
                    },
                    {
                      title: "Annual Comprehensive Report",
                      date: "2024-02-01",
                      provider: "Dr. Sarah Johnson",
                      type: "Annual Summary",
                      status: "In Progress",
                      summary: "Annual comprehensive diabetes management report including all metrics and care plan updates.",
                      attachments: []
                    }
                  ].map((report, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <p className="text-sm text-gray-600">{report.date} • {report.provider}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="text-xs">{report.type}</Badge>
                            <Badge className={report.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {report.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{report.summary}</p>
                        {report.attachments.length > 0 && (
                          <div>
                            <label className="text-xs font-medium text-gray-600">Attachments</label>
                            <div className="space-y-1 mt-1">
                              {report.attachments.map((attachment, i) => (
                                <div key={i} className="flex items-center space-x-2 text-sm">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-health-primary hover:underline cursor-pointer">{attachment}</span>
                                  <Download className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Dietary Tab */}
              <TabsContent value="dietary" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="w-5 h-5 mr-2" />
                        Current Dietary Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Plan Type</label>
                        <p className="text-gray-900">Diabetic Carbohydrate Controlled Diet</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Daily Calorie Target</label>
                        <p className="text-gray-900">1,800 calories</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Carbohydrate Limit</label>
                        <p className="text-gray-900">45-60g per meal</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Meal Distribution</label>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">Breakfast: 450 calories, 45g carbs</p>
                          <p className="text-sm text-gray-700">Lunch: 550 calories, 60g carbs</p>
                          <p className="text-sm text-gray-700">Dinner: 600 calories, 60g carbs</p>
                          <p className="text-sm text-gray-700">Snacks: 200 calories, 15g carbs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dietary Restrictions & Allergies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Food Allergies</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="destructive" className="text-xs">Shellfish</Badge>
                          <Badge variant="secondary" className="text-xs">Tree Nuts</Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Dietary Restrictions</label>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">• Low sodium (&lt; 2,000mg daily)</p>
                          <p className="text-sm text-gray-700">• Limited refined sugars</p>
                          <p className="text-sm text-gray-700">• Portion control</p>
                          <p className="text-sm text-gray-700">• Regular meal timing</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Foods to Avoid</label>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-700">• High glycemic index foods</p>
                          <p className="text-sm text-gray-700">• Processed meats</p>
                          <p className="text-sm text-gray-700">• Sugary beverages</p>
                          <p className="text-sm text-gray-700">• Trans fats</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Dietary Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          date: "2024-01-10",
                          provider: "Nutritionist Sarah Green",
                          focus: "Carbohydrate counting review",
                          recommendations: ["Continue current meal plan", "Add more fiber-rich vegetables", "Monitor portion sizes"],
                          nextAppointment: "2024-02-10"
                        },
                        {
                          date: "2023-12-15",
                          provider: "Dietitian Michael Brown",
                          focus: "Holiday meal planning",
                          recommendations: ["Special occasion meal strategies", "Blood sugar monitoring during holidays", "Alternative dessert options"],
                          nextAppointment: "2024-01-10"
                        }
                      ].map((consultation, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{consultation.focus}</h4>
                            <span className="text-sm text-gray-500">{consultation.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Provider: {consultation.provider}</p>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Recommendations:</label>
                            {consultation.recommendations.map((rec, i) => (
                              <p key={i} className="text-sm text-gray-700">• {rec}</p>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Next appointment: {consultation.nextAppointment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Consents Tab */}
              <TabsContent value="consents" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    {
                      id: "C-EP001-001",
                      scope: "Episode Data Sharing",
                      grantedTo: "Dr. Sarah Johnson",
                      purpose: "Diabetes management and treatment planning",
                      permissions: ["Read episode data", "Update treatment plans", "Order lab tests", "Prescribe medications"],
                      granted: "2024-01-15",
                      expires: "2024-07-15",
                      status: "Active"
                    },
                    {
                      id: "C-EP001-002",
                      scope: "Lab Results Access",
                      grantedTo: "Metro Lab Services",
                      purpose: "Laboratory testing and result reporting",
                      permissions: ["Read lab orders", "Upload test results", "Access previous results"],
                      granted: "2024-01-15",
                      expires: "2024-04-15",
                      status: "Active"
                    },
                    {
                      id: "C-EP001-003",
                      scope: "Pharmacy Access",
                      grantedTo: "Metro Pharmacy",
                      purpose: "Prescription fulfillment and medication counseling",
                      permissions: ["Read prescriptions", "Update dispensing records", "Medication counseling"],
                      granted: "2024-01-14",
                      expires: "2024-07-14",
                      status: "Active"
                    },
                    {
                      id: "C-EP001-004",
                      scope: "Family Emergency Access",
                      grantedTo: "John Doe (Spouse)",
                      purpose: "Emergency health information access",
                      permissions: ["Emergency contact", "Basic health status", "Medication list"],
                      granted: "2024-01-15",
                      expires: "2025-01-15",
                      status: "Active"
                    }
                  ].map((consent, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{consent.scope}</h3>
                            <p className="text-sm text-gray-600">Granted to: {consent.grantedTo}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="text-xs">{consent.id}</Badge>
                            <Badge className="bg-green-100 text-green-800">{consent.status}</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600">Purpose</label>
                            <p className="text-sm text-gray-900">{consent.purpose}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">Granted Date</label>
                            <p className="text-sm text-gray-900">{consent.granted}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">Expires</label>
                            <p className="text-sm text-gray-900">{consent.expires}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">Permissions</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {consent.permissions.map((permission, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Modify
                          </Button>
                          <Button variant="destructive" size="sm">
                            Revoke
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Episode Outcome Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">HbA1c Improvement</span>
                            <span className="text-sm text-green-600">↓ 18.8%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">From 8.5% to 6.9% (Target: &lt;7.0%)</p>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Weight Management</span>
                            <span className="text-sm text-green-600">↓ 3.2%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Lost 5.5 lbs (172 → 166.5 lbs)</p>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Blood Pressure Control</span>
                            <span className="text-sm text-blue-600">Stable</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Average: 128/82 mmHg (Target: &lt;130/80)</p>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Medication Adherence</span>
                            <span className="text-sm text-green-600">95%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Excellent compliance with prescribed regimen</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">Low Risk - Cardiovascular</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">Excellent BP control and improved lipid profile</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium text-yellow-900">Moderate Risk - Diabetic Complications</span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">Continue monitoring for retinopathy and neuropathy</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">Low Risk - Medication Interactions</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">Current medications well-tolerated</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Care Plan Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-900">Continue Current Medications</h4>
                        <p className="text-sm text-blue-700">Metformin and Lisinopril showing excellent results. Maintain current dosages.</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-medium text-green-900">Increase Physical Activity</h4>
                        <p className="text-sm text-green-700">Add 30 minutes of moderate exercise 3x weekly to further improve glycemic control.</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                        <h4 className="font-medium text-orange-900">Monitor for Complications</h4>
                        <p className="text-sm text-orange-700">Schedule annual eye exam and foot screening. Continue quarterly HbA1c monitoring.</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-medium text-purple-900">Patient Education</h4>
                        <p className="text-sm text-purple-700">Reinforce carbohydrate counting and hypoglycemia awareness. Consider diabetes education refresher.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
