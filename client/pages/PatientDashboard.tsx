import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Calendar,
  FileText,
  Heart,
  Shield,
  Bell,
  BellOff,
  BellRing,
  Download,
  Share,
  Plus,
  Clock,
  User,
  Stethoscope,
  TestTube,
  Pill,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  ExternalLink,
  Edit,
  UserCheck,
  X,
  Settings,
  Smartphone,
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
  "insurance_verification",
];

const permissionTemplates: PermissionTemplate[] = [
  {
    id: "emergency",
    name: "Emergency Access",
    description: "Essential permissions for emergency situations",
    permissions: [
      "vitals",
      "allergies",
      "current_medications",
      "medical_history",
    ],
  },
  {
    id: "treating_physician",
    name: "Treating Physician",
    description: "Full access for primary care providers",
    permissions: [
      "full_episode_access",
      "read_write_notes",
      "order_labs",
      "prescribe_medications",
      "modify_treatment_plan",
    ],
  },
  {
    id: "specialist",
    name: "Specialist Consultation",
    description: "Limited access for specialist consultations",
    permissions: [
      "read_vitals",
      "view_lab_results",
      "read_write_notes",
      "order_labs",
    ],
  },
  {
    id: "family_member",
    name: "Family/Caregiver",
    description: "Basic monitoring access for family members",
    permissions: [
      "read_vitals",
      "read_appointments",
      "emergency_notifications",
    ],
  },
  {
    id: "lab_technician",
    name: "Laboratory",
    description: "Lab-specific permissions",
    permissions: ["read_orders", "write_results", "upload_reports"],
  },
];

interface MedicationReminder {
  medicationId: string;
  medicationName: string;
  enabled: boolean;
  times: string[];
  lastTaken?: Date;
  streakCount: number;
}

interface NotificationPermission {
  granted: boolean;
  requested: boolean;
}

export default function PatientDashboard() {
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [episodeDetailsDialog, setEpisodeDetailsDialog] =
    useState<Episode | null>(null);
  const [adminMode, setAdminMode] = useState(true); // Set to true to simulate admin access
  const [modifyPermissionDialog, setModifyPermissionDialog] =
    useState<Consent | null>(null);
  const [revokePermissionDialog, setRevokePermissionDialog] =
    useState<Consent | null>(null);
  const [grantPermissionDialog, setGrantPermissionDialog] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [newConsentData, setNewConsentData] = useState({
    grantedTo: "",
    purpose: "",
    expires: "",
    customPermissions: [] as string[],
  });

  // Notification state management
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>({
    granted: false,
    requested: false
  });
  const [medicationReminders, setMedicationReminders] = useState<MedicationReminder[]>([
    {
      medicationId: "metformin-1000mg",
      medicationName: "Metformin 1000mg",
      enabled: false,
      times: ["08:00", "20:00"],
      streakCount: 5
    },
    {
      medicationId: "lisinopril-10mg",
      medicationName: "Lisinopril 10mg",
      enabled: false,
      times: ["08:00"],
      streakCount: 12
    }
  ]);
  const [notificationSettingsDialog, setNotificationSettingsDialog] = useState(false);

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

  // Notification helper functions
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationPermission({ granted: true, requested: true });
      return;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      setNotificationPermission({
        granted: permission === "granted",
        requested: true
      });
    }
  };

  const scheduleNotification = (medicationName: string, time: string) => {
    if (!notificationPermission.granted) return;

    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);

    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    setTimeout(() => {
      new Notification(`Medication Reminder`, {
        body: `Time to take your ${medicationName}`,
        icon: "/pill-icon.png",
        badge: "/pill-badge.png",
        tag: `medication-${medicationName}`,
        requireInteraction: true,
        actions: [
          { action: "taken", title: "Mark as Taken" },
          { action: "snooze", title: "Remind in 10 min" }
        ]
      });
    }, timeUntilNotification);
  };

  const toggleMedicationReminder = (medicationId: string, enabled: boolean) => {
    setMedicationReminders(prev =>
      prev.map(reminder =>
        reminder.medicationId === medicationId
          ? { ...reminder, enabled }
          : reminder
      )
    );

    if (enabled && notificationPermission.granted) {
      const medication = medicationReminders.find(m => m.medicationId === medicationId);
      if (medication) {
        medication.times.forEach(time => {
          scheduleNotification(medication.medicationName, time);
        });
      }
    }
  };

  const markMedicationTaken = (medicationId: string) => {
    setMedicationReminders(prev =>
      prev.map(reminder =>
        reminder.medicationId === medicationId
          ? {
              ...reminder,
              lastTaken: new Date(),
              streakCount: reminder.streakCount + 1
            }
          : reminder
      )
    );
  };

  // Initialize notification permission check
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission({
        granted: Notification.permission === "granted",
        requested: Notification.permission !== "default"
      });
    }
  }, []);

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

          {/* Consents Tab with Admin Authorization */}
          <TabsContent value="consents" className="space-y-6">
            <div className="space-y-4">
              {adminMode && (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-health-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Authorization Management
                    </h3>
                    <Badge className="bg-blue-100 text-blue-800">
                      Admin Mode
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setGrantPermissionDialog(true)}
                    className="bg-health-primary hover:bg-health-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Grant New Permission
                  </Button>
                </div>
              )}
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
                          {adminMode ? (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setModifyPermissionDialog(consent)
                                }
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Modify
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setRevokePermissionDialog(consent)
                                }
                              >
                                <X className="w-3 h-3 mr-1" />
                                Revoke
                              </Button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Lock className="w-3 h-3 mr-1" />
                                View Only
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  {[
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
                  ].map((activity, index) => {
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-health-primary" />
                  Health Insights
                </CardTitle>
                <CardDescription>
                  AI-powered health analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <TestTube className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Lab Work Due</p>
                      <p className="text-sm text-blue-700">
                        Schedule your quarterly HbA1c test
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Due in 2 weeks
                      </p>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modify Permission Dialog */}
      <Dialog
        open={!!modifyPermissionDialog}
        onOpenChange={() => setModifyPermissionDialog(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-health-primary" />
              Modify Permissions
            </DialogTitle>
            <DialogDescription>
              Modify permissions for {modifyPermissionDialog?.scope} granted to{" "}
              {modifyPermissionDialog?.grantedTo}
            </DialogDescription>
          </DialogHeader>
          {modifyPermissionDialog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grantedTo">Granted To</Label>
                  <Input
                    id="grantedTo"
                    value={modifyPermissionDialog.grantedTo}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Label htmlFor="expires">Expires</Label>
                  <Input
                    id="expires"
                    type="date"
                    defaultValue={modifyPermissionDialog.expires}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea
                  id="purpose"
                  defaultValue={modifyPermissionDialog.purpose}
                  className="h-20"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Current Permissions
                </Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`modify-${permission}`}
                        defaultChecked={modifyPermissionDialog.permissions.includes(
                          permission,
                        )}
                      />
                      <Label
                        htmlFor={`modify-${permission}`}
                        className="text-sm"
                      >
                        {permission
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModifyPermissionDialog(null)}
            >
              Cancel
            </Button>
            <Button className="bg-health-primary hover:bg-health-primary/90">
              Update Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Permission Dialog */}
      <Dialog
        open={!!revokePermissionDialog}
        onOpenChange={() => setRevokePermissionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <X className="w-5 h-5 mr-2" />
              Revoke Permissions
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke permissions for{" "}
              {revokePermissionDialog?.scope}?
            </DialogDescription>
          </DialogHeader>
          {revokePermissionDialog && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">
                  This will revoke the following permissions:
                </h4>
                <div className="grid grid-cols-1 gap-1">
                  {revokePermissionDialog.permissions.map(
                    (permission, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-red-700"
                      >
                        <X className="w-3 h-3 mr-2 flex-shrink-0" />
                        {permission
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="revokeReason">Reason for Revocation</Label>
                <Textarea
                  id="revokeReason"
                  placeholder="Please provide a reason for revoking these permissions..."
                  className="h-20"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  This action cannot be undone. The user will need to request
                  new permissions.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRevokePermissionDialog(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRevokePermissionDialog(null)}
            >
              Revoke Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grant New Permission Dialog */}
      <Dialog
        open={grantPermissionDialog}
        onOpenChange={setGrantPermissionDialog}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-health-primary" />
              Grant New Permissions
            </DialogTitle>
            <DialogDescription>
              Create a new permission grant for accessing patient data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Permission Templates */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Quick Templates
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-health-primary bg-health-primary/5"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setSelectedPermissions(template.permissions);
                    }}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-gray-900">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.permissions.slice(0, 3).map((perm) => (
                          <Badge
                            key={perm}
                            variant="secondary"
                            className="text-xs"
                          >
                            {perm.replace(/_/g, " ")}
                          </Badge>
                        ))}
                        {template.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Grant Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grantTo">Grant To</Label>
                <Input
                  id="grantTo"
                  placeholder="Enter name or email"
                  value={newConsentData.grantedTo}
                  onChange={(e) =>
                    setNewConsentData({
                      ...newConsentData,
                      grantedTo: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="expiresDate">Expires</Label>
                <Input
                  id="expiresDate"
                  type="date"
                  value={newConsentData.expires}
                  onChange={(e) =>
                    setNewConsentData({
                      ...newConsentData,
                      expires: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purposeText">Purpose</Label>
              <Textarea
                id="purposeText"
                placeholder="Describe the purpose for these permissions..."
                value={newConsentData.purpose}
                onChange={(e) =>
                  setNewConsentData({
                    ...newConsentData,
                    purpose: e.target.value,
                  })
                }
                className="h-20"
              />
            </div>

            {/* Custom Permissions */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Custom Permissions
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grant-${permission}`}
                      checked={selectedPermissions.includes(permission)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPermissions([
                            ...selectedPermissions,
                            permission,
                          ]);
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter((p) => p !== permission),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`grant-${permission}`} className="text-sm">
                      {permission
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Permissions Summary */}
            {selectedPermissions.length > 0 && (
              <div className="bg-health-primary/5 border border-health-primary/20 rounded-lg p-4">
                <h4 className="font-medium text-health-primary mb-2">
                  Selected Permissions ({selectedPermissions.length})
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedPermissions.map((permission) => (
                    <Badge
                      key={permission}
                      className="bg-health-primary text-white"
                    >
                      {permission
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setGrantPermissionDialog(false);
                setSelectedTemplate("");
                setSelectedPermissions([]);
                setNewConsentData({
                  grantedTo: "",
                  purpose: "",
                  expires: "",
                  customPermissions: [],
                });
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-health-primary hover:bg-health-primary/90"
              disabled={
                !newConsentData.grantedTo ||
                !newConsentData.purpose ||
                selectedPermissions.length === 0
              }
            >
              Grant Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comprehensive Episode Details Dialog */}
      <Dialog
        open={!!episodeDetailsDialog}
        onOpenChange={() => setEpisodeDetailsDialog(null)}
      >
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <FileText className="w-6 h-6 mr-3 text-health-primary" />
              {episodeDetailsDialog?.title}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {episodeDetailsDialog?.diagnosis} • Episode{" "}
              {episodeDetailsDialog?.id} • Started{" "}
              {episodeDetailsDialog?.startDate}
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
                        <label className="text-sm font-medium text-gray-600">
                          Diagnosis
                        </label>
                        <p className="text-gray-900">
                          {episodeDetailsDialog.diagnosis}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Status
                        </label>
                        <Badge
                          className={`${episodeDetailsDialog.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {episodeDetailsDialog.status}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Severity
                        </label>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              episodeDetailsDialog.severity === "critical"
                                ? "bg-red-500"
                                : episodeDetailsDialog.severity === "high"
                                  ? "bg-orange-500"
                                  : episodeDetailsDialog.severity === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                            }`}
                          />
                          <span className="capitalize">
                            {episodeDetailsDialog.severity}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Duration
                        </label>
                        <p className="text-gray-900">
                          {episodeDetailsDialog.startDate} -{" "}
                          {episodeDetailsDialog.endDate || "Ongoing"}
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
                        <label className="text-sm font-medium text-gray-600">
                          Primary Provider
                        </label>
                        <p className="text-gray-900">
                          {episodeDetailsDialog.provider}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Facility
                        </label>
                        <p className="text-gray-900">
                          {episodeDetailsDialog.facility}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Specialty
                        </label>
                        <p className="text-gray-900">Endocrinology</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Care Coordinator
                        </label>
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
                          <div className="text-lg font-semibold text-blue-900">
                            12
                          </div>
                          <div className="text-xs text-blue-600">Visits</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <div className="text-lg font-semibold text-green-900">
                            {episodeDetailsDialog.artifacts}
                          </div>
                          <div className="text-xs text-green-600">
                            Artifacts
                          </div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded">
                          <div className="text-lg font-semibold text-purple-900">
                            8
                          </div>
                          <div className="text-xs text-purple-600">
                            Lab Tests
                          </div>
                        </div>
                        <div className="p-2 bg-orange-50 rounded">
                          <div className="text-lg font-semibold text-orange-900">
                            5
                          </div>
                          <div className="text-xs text-orange-600">
                            Medications
                          </div>
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
                        {
                          date: "2024-01-15 14:30",
                          event: "HbA1c Lab Results",
                          description: "HbA1c: 6.9% (Improved from 7.2%)",
                          type: "lab",
                          icon: TestTube,
                        },
                        {
                          date: "2024-01-14 09:00",
                          event: "Medication Adjustment",
                          description:
                            "Metformin increased to 1000mg twice daily",
                          type: "medication",
                          icon: Pill,
                        },
                        {
                          date: "2024-01-12 11:15",
                          event: "Routine Follow-up Visit",
                          description:
                            "Blood glucose levels reviewed, patient education provided",
                          type: "visit",
                          icon: Stethoscope,
                        },
                        {
                          date: "2024-01-10 16:45",
                          event: "Dietary Consultation",
                          description:
                            "Nutrition plan updated, carb counting reviewed",
                          type: "dietary",
                          icon: Heart,
                        },
                      ].map((activity, index) => {
                        const IconComponent = activity.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-start space-x-4"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                activity.type === "lab"
                                  ? "bg-blue-100"
                                  : activity.type === "medication"
                                    ? "bg-purple-100"
                                    : activity.type === "visit"
                                      ? "bg-green-100"
                                      : "bg-orange-100"
                              }`}
                            >
                              <IconComponent
                                className={`w-5 h-5 ${
                                  activity.type === "lab"
                                    ? "text-blue-600"
                                    : activity.type === "medication"
                                      ? "text-purple-600"
                                      : activity.type === "visit"
                                        ? "text-green-600"
                                        : "text-orange-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">
                                  {activity.event}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {activity.date}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {activity.description}
                              </p>
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
                      notes:
                        "Patient reports improved energy levels. Blood glucose logs reviewed. Medication compliance excellent.",
                      vitals: {
                        bp: "128/82",
                        hr: "72",
                        weight: "165 lbs",
                        temp: "98.6°F",
                      },
                    },
                    {
                      date: "2024-01-08",
                      time: "10:00",
                      type: "Consultation",
                      provider: "Dr. Sarah Johnson",
                      location: "Metro Health Center - Room 203",
                      duration: "30 min",
                      status: "Completed",
                      notes:
                        "Quarterly review. HbA1c results discussed. Patient education on carbohydrate counting provided.",
                      vitals: {
                        bp: "132/85",
                        hr: "68",
                        weight: "167 lbs",
                        temp: "98.4°F",
                      },
                    },
                    {
                      date: "2024-01-22",
                      time: "09:30",
                      type: "Follow-up",
                      provider: "Dr. Sarah Johnson",
                      location: "Metro Health Center - Room 203",
                      duration: "30 min",
                      status: "Scheduled",
                      notes:
                        "Upcoming visit to review medication effectiveness and discuss exercise plan.",
                      vitals: null,
                    },
                  ].map((visit, index) => (
                    <Card
                      key={index}
                      className={
                        visit.status === "Scheduled"
                          ? "border-blue-200 bg-blue-50"
                          : ""
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {visit.type} Visit
                            </h3>
                            <p className="text-sm text-gray-600">
                              {visit.date} at {visit.time}
                            </p>
                          </div>
                          <Badge
                            className={
                              visit.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {visit.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Provider
                            </label>
                            <p className="text-sm text-gray-900">
                              {visit.provider}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Location
                            </label>
                            <p className="text-sm text-gray-900">
                              {visit.location}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Duration
                            </label>
                            <p className="text-sm text-gray-900">
                              {visit.duration}
                            </p>
                          </div>
                        </div>
                        {visit.vitals && (
                          <div className="grid grid-cols-4 gap-2 mb-3 p-2 bg-gray-50 rounded">
                            <div className="text-center">
                              <div className="text-xs text-gray-600">BP</div>
                              <div className="font-medium">
                                {visit.vitals.bp}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600">HR</div>
                              <div className="font-medium">
                                {visit.vitals.hr}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600">
                                Weight
                              </div>
                              <div className="font-medium">
                                {visit.vitals.weight}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-600">Temp</div>
                              <div className="font-medium">
                                {visit.vitals.temp}
                              </div>
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
                      instructions:
                        "Take with breakfast and dinner. Monitor for gastrointestinal side effects.",
                      sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
                      lastFilled: "2024-01-14",
                      nextRefill: "2024-02-14",
                      pharmacy: "Metro Pharmacy",
                    },
                    {
                      name: "Lisinopril",
                      strength: "10mg",
                      dosage: "Once daily",
                      prescribed: "2024-01-08",
                      prescriber: "Dr. Sarah Johnson",
                      status: "Active",
                      instructions:
                        "Take at the same time each day. Monitor blood pressure.",
                      sideEffects: ["Dry cough", "Dizziness", "Hyperkalemia"],
                      lastFilled: "2024-01-08",
                      nextRefill: "2024-02-08",
                      pharmacy: "Metro Pharmacy",
                    },
                    {
                      name: "Atorvastatin",
                      strength: "20mg",
                      dosage: "Once daily at bedtime",
                      prescribed: "2023-12-15",
                      prescriber: "Dr. Sarah Johnson",
                      status: "Discontinued",
                      instructions:
                        "Discontinued due to muscle pain. Monitor cholesterol levels.",
                      sideEffects: ["Muscle pain", "Elevated liver enzymes"],
                      lastFilled: "2023-12-15",
                      nextRefill: "N/A",
                      pharmacy: "Metro Pharmacy",
                    },
                  ].map((med, index) => (
                    <Card
                      key={index}
                      className={
                        med.status === "Discontinued" ? "opacity-75" : ""
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {med.name} {med.strength}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {med.dosage}
                            </p>
                          </div>
                          <Badge
                            className={
                              med.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {med.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Prescribed By
                            </label>
                            <p className="text-sm text-gray-900">
                              {med.prescriber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {med.prescribed}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Pharmacy
                            </label>
                            <p className="text-sm text-gray-900">
                              {med.pharmacy}
                            </p>
                            <p className="text-xs text-gray-500">
                              Last filled: {med.lastFilled}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Next Refill
                            </label>
                            <p className="text-sm text-gray-900">
                              {med.nextRefill}
                            </p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="text-xs font-medium text-gray-600">
                            Instructions
                          </label>
                          <p className="text-sm text-gray-700">
                            {med.instructions}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">
                            Potential Side Effects
                          </label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {med.sideEffects.map((effect, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
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
                        {
                          test: "HbA1c",
                          value: "6.9%",
                          range: "< 7.0%",
                          status: "Normal",
                          trend: "Improved",
                        },
                        {
                          test: "Fasting Glucose",
                          value: "128 mg/dL",
                          range: "70-100 mg/dL",
                          status: "High",
                          trend: "Stable",
                        },
                        {
                          test: "Creatinine",
                          value: "1.0 mg/dL",
                          range: "0.7-1.3 mg/dL",
                          status: "Normal",
                          trend: "Stable",
                        },
                        {
                          test: "eGFR",
                          value: "85 mL/min/1.73m²",
                          range: "> 60",
                          status: "Normal",
                          trend: "Stable",
                        },
                      ],
                    },
                    {
                      date: "2024-01-08",
                      orderingProvider: "Dr. Sarah Johnson",
                      lab: "Metro Lab Services",
                      status: "Completed",
                      results: [
                        {
                          test: "Lipid Panel",
                          value: "Total: 195 mg/dL",
                          range: "< 200 mg/dL",
                          status: "Normal",
                          trend: "Stable",
                        },
                        {
                          test: "LDL Cholesterol",
                          value: "118 mg/dL",
                          range: "< 100 mg/dL",
                          status: "High",
                          trend: "Improved",
                        },
                        {
                          test: "HDL Cholesterol",
                          value: "45 mg/dL",
                          range: "> 40 mg/dL",
                          status: "Normal",
                          trend: "Stable",
                        },
                        {
                          test: "Triglycerides",
                          value: "160 mg/dL",
                          range: "< 150 mg/dL",
                          status: "High",
                          trend: "Stable",
                        },
                      ],
                    },
                    {
                      date: "2024-01-22",
                      orderingProvider: "Dr. Sarah Johnson",
                      lab: "Metro Lab Services",
                      status: "Scheduled",
                      results: [
                        {
                          test: "Comprehensive Metabolic Panel",
                          value: "Pending",
                          range: "Various",
                          status: "Pending",
                          trend: "-",
                        },
                        {
                          test: "Thyroid Function",
                          value: "Pending",
                          range: "Various",
                          status: "Pending",
                          trend: "-",
                        },
                      ],
                    },
                  ].map((labOrder, index) => (
                    <Card
                      key={index}
                      className={
                        labOrder.status === "Scheduled"
                          ? "border-blue-200 bg-blue-50"
                          : ""
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Lab Order - {labOrder.date}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Ordered by {labOrder.orderingProvider}
                            </p>
                            <p className="text-sm text-gray-600">
                              {labOrder.lab}
                            </p>
                          </div>
                          <Badge
                            className={
                              labOrder.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {labOrder.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {labOrder.results.map((result, i) => (
                            <div
                              key={i}
                              className="grid grid-cols-5 gap-2 p-2 bg-gray-50 rounded text-sm"
                            >
                              <div className="font-medium">{result.test}</div>
                              <div className="text-center">{result.value}</div>
                              <div className="text-center text-gray-600">
                                {result.range}
                              </div>
                              <div className="text-center">
                                <Badge
                                  className={
                                    result.status === "Normal"
                                      ? "bg-green-100 text-green-800"
                                      : result.status === "High"
                                        ? "bg-red-100 text-red-800"
                                        : result.status === "Low"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {result.status}
                                </Badge>
                              </div>
                              <div className="text-center">
                                {result.trend === "Improved" && (
                                  <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                                )}
                                {result.trend === "Stable" && (
                                  <div className="w-4 h-4 bg-gray-400 rounded-full mx-auto" />
                                )}
                                {result.trend === "Worsened" && (
                                  <div className="w-4 h-4 bg-red-400 rounded-full mx-auto" />
                                )}
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
                      title: "Quarterly Diabetes Management Report",
                      date: "2024-01-15",
                      type: "Clinical Summary",
                      provider: "Dr. Sarah Johnson",
                      summary:
                        "Comprehensive review of diabetes management over Q4 2023. Patient shows significant improvement in glucose control.",
                      attachments: [
                        "Quarterly_Report_Q4_2023.pdf",
                        "Lab_Trends_Analysis.pdf",
                      ],
                    },
                    {
                      title: "Retinal Screening Report",
                      date: "2024-01-10",
                      type: "Specialist Report",
                      provider: "Dr. Amanda Chen, Ophthalmologist",
                      summary:
                        "Annual diabetic retinal screening completed. No signs of diabetic retinopathy detected.",
                      attachments: [
                        "Retinal_Screening_2024.pdf",
                        "Fundus_Photos.pdf",
                      ],
                    },
                    {
                      title: "Nutrition Assessment",
                      date: "2024-01-05",
                      type: "Dietary Report",
                      provider: "Sarah Martinez, RD",
                      summary:
                        "Nutritional assessment and meal planning review. Patient demonstrates good understanding of carbohydrate counting.",
                      attachments: [
                        "Nutrition_Assessment.pdf",
                        "Meal_Plan_Update.pdf",
                      ],
                    },
                  ].map((report, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {report.provider}
                            </p>
                            <p className="text-sm text-gray-600">
                              {report.date}
                            </p>
                          </div>
                          <Badge variant="outline">{report.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {report.summary}
                        </p>
                        {report.attachments && (
                          <div>
                            <label className="text-xs font-medium text-gray-600 mb-2 block">
                              Attachments
                            </label>
                            <div className="space-y-1">
                              {report.attachments.map((attachment, i) => (
                                <div
                                  key={i}
                                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  {attachment}
                                  <ExternalLink className="w-3 h-3 ml-auto" />
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
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-red-500" />
                        Current Dietary Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-900">
                            1800
                          </div>
                          <div className="text-sm text-green-600">
                            Daily Calories
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-900">
                            45g
                          </div>
                          <div className="text-sm text-blue-600">
                            Carbs per Meal
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-2xl font-bold text-purple-900">
                            25g
                          </div>
                          <div className="text-sm text-purple-600">
                            Daily Fiber
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Meal Timing
                          </label>
                          <p className="text-sm text-gray-700">
                            Breakfast: 7:00 AM | Lunch: 12:00 PM | Dinner: 6:00
                            PM | Snacks: 3:00 PM, 9:00 PM
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Key Recommendations
                          </label>
                          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                            <li>
                              Focus on complex carbohydrates and high-fiber
                              foods
                            </li>
                            <li>Include lean protein with each meal</li>
                            <li>Limit simple sugars and processed foods</li>
                            <li>Monitor portion sizes using plate method</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dietary Restrictions & Allergies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-2 block">
                            Food Allergies
                          </label>
                          <div className="space-y-2">
                            <Badge variant="destructive" className="mr-2">
                              Tree Nuts
                            </Badge>
                            <Badge variant="destructive">Shellfish</Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-2 block">
                            Dietary Restrictions
                          </label>
                          <div className="space-y-2">
                            <Badge variant="secondary" className="mr-2">
                              Low Sodium
                            </Badge>
                            <Badge variant="secondary">Diabetic Diet</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Nutrition Consultations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            date: "2024-01-10",
                            nutritionist: "Sarah Martinez, RD",
                            topic: "Carbohydrate Counting Review",
                            notes:
                              "Patient demonstrates improved understanding of carb counting. Discussed meal planning strategies.",
                            recommendations: [
                              "Continue current meal timing",
                              "Increase vegetable portions",
                              "Try new whole grain options",
                            ],
                          },
                          {
                            date: "2023-12-15",
                            nutritionist: "Sarah Martinez, RD",
                            topic: "Holiday Meal Planning",
                            notes:
                              "Discussed strategies for managing blood sugar during holiday celebrations.",
                            recommendations: [
                              "Focus on portion control",
                              "Bring diabetes-friendly options to gatherings",
                              "Plan extra glucose monitoring",
                            ],
                          },
                        ].map((consultation, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {consultation.topic}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {consultation.nutritionist}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {consultation.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {consultation.notes}
                            </p>
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                Recommendations:
                              </label>
                              {consultation.recommendations.map((rec, i) => (
                                <p key={i} className="text-sm text-gray-700">
                                  • {rec}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Consents Tab */}
              <TabsContent value="consents" className="space-y-6">
                <div className="grid gap-4">
                  {[
                    {
                      id: "EC-001",
                      type: "Episode-Specific Consent",
                      grantedTo: "Dr. Sarah Johnson",
                      purpose:
                        "Primary diabetes management and care coordination",
                      permissions: [
                        "Full Episode Access",
                        "Treatment Planning",
                        "Medication Management",
                        "Lab Ordering",
                      ],
                      expires: "2024-12-31",
                      status: "Active",
                      grantedDate: "2024-01-15",
                    },
                    {
                      id: "EC-002",
                      type: "Specialist Referral",
                      grantedTo: "Dr. Amanda Chen, Ophthalmologist",
                      purpose: "Diabetic retinopathy screening and monitoring",
                      permissions: [
                        "View Lab Results",
                        "Access Medical History",
                        "Generate Reports",
                      ],
                      expires: "2024-06-30",
                      status: "Active",
                      grantedDate: "2024-01-01",
                    },
                    {
                      id: "EC-003",
                      type: "Pharmacy Access",
                      grantedTo: "Metro Pharmacy",
                      purpose:
                        "Prescription fulfillment and medication counseling",
                      permissions: [
                        "View Prescriptions",
                        "Medication History",
                        "Allergy Information",
                      ],
                      expires: "2024-12-31",
                      status: "Active",
                      grantedDate: "2024-01-15",
                    },
                  ].map((consent, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {consent.type}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Granted to {consent.grantedTo}
                            </p>
                            <p className="text-xs text-gray-500">
                              Granted: {consent.grantedDate}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {consent.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {consent.purpose}
                        </p>
                        <div className="mb-3">
                          <label className="text-xs font-medium text-gray-600 mb-1 block">
                            Permissions
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {consent.permissions.map((permission, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Expires: {consent.expires}
                          </span>
                          <span className="text-gray-600">
                            ID: {consent.id}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="space-y-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-health-primary" />
                        Episode Progress Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-900">
                            87%
                          </div>
                          <div className="text-sm text-green-600">
                            Treatment Adherence
                          </div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-900">
                            15%
                          </div>
                          <div className="text-sm text-blue-600">
                            HbA1c Improvement
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-2xl font-bold text-purple-900">
                            6.9%
                          </div>
                          <div className="text-sm text-purple-600">
                            Current HbA1c
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Powered Health Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900">
                              Excellent Progress
                            </p>
                            <p className="text-sm text-green-700">
                              Your HbA1c has improved by 15% since episode
                              start. Continue current treatment plan.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <TestTube className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-900">
                              Upcoming Recommendations
                            </p>
                            <p className="text-sm text-blue-700">
                              Consider scheduling lipid panel in 3 months to
                              monitor cardiovascular risk factors.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-900">
                              Attention Needed
                            </p>
                            <p className="text-sm text-yellow-700">
                              Fasting glucose levels occasionally above target.
                              Consider adjusting meal timing or medication.
                            </p>
                          </div>
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
                              <p className="text-sm text-blue-700">
                                None detected
                              </p>
                            </div>
                          </div>
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Treatment Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-health-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Continue Current Medication Regimen
                            </p>
                            <p className="text-sm text-gray-600">
                              Current diabetes medications are effective.
                              Maintain current dosing.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-health-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Increase Physical Activity
                            </p>
                            <p className="text-sm text-gray-600">
                              Add 15 minutes of walking daily to improve glucose
                              control and cardiovascular health.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-health-primary rounded-full mt-2"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Regular Monitoring
                            </p>
                            <p className="text-sm text-gray-600">
                              Continue quarterly HbA1c testing and annual
                              comprehensive eye exams.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
