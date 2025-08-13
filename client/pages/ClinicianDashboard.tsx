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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Monitor,
  Pill,
  Plus,
  Search,
  Stethoscope,
  TestTube,
  TrendingUp,
  TrendingDown,
  User,
  Users,
  Zap,
  Eye,
  Edit,
  Send,
  Phone,
  Video,
  MessageSquare,
  Download,
  Upload,
  Filter,
  MoreHorizontal,
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  activeEpisodes: number;
  lastVisit: string;
  riskScore: number;
  status: "stable" | "moderate" | "critical" | "improving";
  avatar?: string;
}

interface Episode {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  status: "active" | "pending" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  lastUpdate: string;
  daysActive: number;
  nextAction: string;
}

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  patientName: string;
  message: string;
  time: string;
  acknowledged: boolean;
}

export default function ClinicianDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Episode dialog states
  const [viewEpisodeDialog, setViewEpisodeDialog] = useState<Episode | null>(null);
  const [editEpisodeDialog, setEditEpisodeDialog] = useState<Episode | null>(null);
  const [noteEpisodeDialog, setNoteEpisodeDialog] = useState<Episode | null>(null);
  const [newNote, setNewNote] = useState("");
  const [editingEpisode, setEditingEpisode] = useState<Partial<Episode>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patients: Patient[] = [
    {
      id: "P-001",
      name: "Maria Rodriguez",
      age: 58,
      gender: "Female",
      mrn: "MRN-2024-001",
      activeEpisodes: 2,
      lastVisit: "2024-01-15",
      riskScore: 85,
      status: "critical",
    },
    {
      id: "P-002",
      name: "John Thompson",
      age: 45,
      gender: "Male",
      mrn: "MRN-2024-002",
      activeEpisodes: 1,
      lastVisit: "2024-01-14",
      riskScore: 45,
      status: "stable",
    },
    {
      id: "P-003",
      name: "Sarah Chen",
      age: 72,
      gender: "Female",
      mrn: "MRN-2024-003",
      activeEpisodes: 3,
      lastVisit: "2024-01-13",
      riskScore: 68,
      status: "moderate",
    },
    {
      id: "P-004",
      name: "David Wilson",
      age: 33,
      gender: "Male",
      mrn: "MRN-2024-004",
      activeEpisodes: 1,
      lastVisit: "2024-01-12",
      riskScore: 25,
      status: "improving",
    },
  ];

  const episodes: Episode[] = [
    {
      id: "EP-2024-001",
      patientId: "P-001",
      patientName: "Maria Rodriguez",
      diagnosis: "Acute Myocardial Infarction",
      status: "active",
      priority: "critical",
      lastUpdate: "15 min ago",
      daysActive: 3,
      nextAction: "ICU monitoring review",
    },
    {
      id: "EP-2024-002",
      patientId: "P-002",
      patientName: "John Thompson",
      diagnosis: "Type 2 Diabetes Management",
      status: "active",
      priority: "medium",
      lastUpdate: "2 hours ago",
      daysActive: 45,
      nextAction: "Lab results review",
    },
    {
      id: "EP-2024-003",
      patientId: "P-003",
      patientName: "Sarah Chen",
      diagnosis: "Chronic Heart Failure",
      status: "active",
      priority: "high",
      lastUpdate: "4 hours ago",
      daysActive: 12,
      nextAction: "Medication adjustment",
    },
    {
      id: "EP-2024-004",
      patientId: "P-004",
      patientName: "David Wilson",
      diagnosis: "Post-Op Recovery",
      status: "active",
      priority: "low",
      lastUpdate: "1 day ago",
      daysActive: 7,
      nextAction: "Follow-up consultation",
    },
  ];

  const alerts: Alert[] = [
    {
      id: "A-001",
      type: "critical",
      patientName: "Maria Rodriguez",
      message: "Cardiac enzyme levels elevated - immediate attention required",
      time: "5 min ago",
      acknowledged: false,
    },
    {
      id: "A-002",
      type: "warning",
      patientName: "Sarah Chen",
      message: "Blood pressure outside target range",
      time: "1 hour ago",
      acknowledged: false,
    },
    {
      id: "A-003",
      type: "info",
      patientName: "John Thompson",
      message: "Lab results available for review",
      time: "2 hours ago",
      acknowledged: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "moderate":
        return "text-orange-600 bg-orange-100";
      case "stable":
        return "text-green-600 bg-green-100";
      case "improving":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50";
      case "warning":
        return "border-yellow-500 bg-yellow-50";
      case "info":
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const todayStats = {
    totalPatients: 47,
    activeEpisodes: 23,
    criticalAlerts: 3,
    pendingActions: 12,
    scheduledVisits: 8,
    labResults: 15,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Clinician Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage patient episodes and workflows
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm">
              <TestTube className="w-4 h-4 mr-2" />
              Lab Orders
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.totalPatients}
                  </p>
                </div>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Episodes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.activeEpisodes}
                  </p>
                </div>
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {todayStats.criticalAlerts}
                  </p>
                </div>
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.pendingActions}
                  </p>
                </div>
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visits</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.scheduledVisits}
                  </p>
                </div>
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Lab Results
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats.labResults}
                  </p>
                </div>
                <TestTube className="w-6 h-6 text-medical-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        {alerts.filter((alert) => !alert.acknowledged).length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts
                  .filter((alert) => !alert.acknowledged)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {alert.patientName}
                          </p>
                          <p className="text-sm text-gray-700">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500">{alert.time}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm">Acknowledge</Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="episodes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="icu">ICU Monitoring</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Episodes Tab */}
          <TabsContent value="episodes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Active Episodes
              </h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {episodes.map((episode) => (
                <Card
                  key={episode.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {episode.id}
                          </Badge>
                          <div
                            className={`w-2 h-2 rounded-full ${getPriorityColor(episode.priority)}`}
                          />
                          <span className="text-xs text-gray-500 capitalize">
                            {episode.priority} priority
                          </span>
                        </div>
                        <CardTitle className="text-lg">
                          {episode.patientName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {episode.diagnosis}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Update</span>
                        <span className="font-medium">
                          {episode.lastUpdate}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Days Active</span>
                        <span className="font-medium">
                          {episode.daysActive}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Next Action
                        </p>
                        <p className="text-sm text-gray-600">
                          {episode.nextAction}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Note
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <Card
                  key={patient.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-health-primary to-health-secondary rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {patient.name}
                          </CardTitle>
                          <CardDescription>
                            {patient.age}y {patient.gender} • {patient.mrn}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Active Episodes</span>
                        <span className="font-medium">
                          {patient.activeEpisodes}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Visit</span>
                        <span className="font-medium">{patient.lastVisit}</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            Risk Score
                          </span>
                          <span className="text-sm font-medium">
                            {patient.riskScore}
                          </span>
                        </div>
                        <Progress value={patient.riskScore} className="h-2" />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ICU Monitoring Tab */}
          <TabsContent value="icu" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Real-Time Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <div>
                          <p className="font-medium text-red-900">
                            Maria Rodriguez
                          </p>
                          <p className="text-sm text-red-700">
                            Cardiac monitoring - Room 301
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Monitor
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">Heart Rate</p>
                        <p className="text-2xl font-bold text-blue-900">
                          98 BPM
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">Blood Pressure</p>
                        <p className="text-2xl font-bold text-green-900">
                          120/80
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-700">O2 Saturation</p>
                        <p className="text-2xl font-bold text-purple-900">
                          98%
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-700">Temperature</p>
                        <p className="text-2xl font-bold text-orange-900">
                          98.6°F
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Alert Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Heart Rate Threshold
                        </p>
                        <p className="text-sm text-gray-600">
                          Alert if &gt; 100 BPM
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          BP Critical Range
                        </p>
                        <p className="text-sm text-gray-600">
                          Alert if &gt; 140/90
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          O2 Saturation
                        </p>
                        <p className="text-sm text-gray-600">
                          Alert if &lt; 95%
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="w-5 h-5 mr-2" />
                    Lab Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">
                          HbA1c - John Thompson
                        </p>
                        <p className="text-sm text-blue-700">
                          Ordered 2 hours ago
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">
                          Lipid Panel - Sarah Chen
                        </p>
                        <p className="text-sm text-green-700">
                          Results available
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Completed
                      </Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    New Lab Order
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900">
                          Metformin - John Thompson
                        </p>
                        <p className="text-sm text-purple-700">
                          500mg twice daily
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-orange-900">
                          Lisinopril - Sarah Chen
                        </p>
                        <p className="text-sm text-orange-700">
                          Renewal needed
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Expiring
                      </Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    E-Prescribe
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Recovery Rate
                        </span>
                        <span className="text-sm text-green-600">↑ 12%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Readmission Rate
                        </span>
                        <span className="text-sm text-red-600">↓ 8%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Patient Satisfaction
                        </span>
                        <span className="text-sm text-green-600">↑ 5%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workflow Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">
                          Average Episode Duration
                        </p>
                        <p className="text-sm text-blue-700">12.3 days</p>
                      </div>
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900">
                          Documentation Time
                        </p>
                        <p className="text-sm text-green-700">
                          8.5 min/patient
                        </p>
                      </div>
                      <TrendingDown className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-purple-900">
                          Alert Response Time
                        </p>
                        <p className="text-sm text-purple-700">2.1 minutes</p>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600" />
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
