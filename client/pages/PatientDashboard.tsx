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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    </Layout>
  );
}
