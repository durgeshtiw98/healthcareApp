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
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock,
  ExternalLink,
  Edit,
  UserCheck,
  X,
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
  const [adminMode, setAdminMode] = useState(true); // Set to true to simulate admin access
  const [modifyPermissionDialog, setModifyPermissionDialog] = useState<Consent | null>(null);
  const [revokePermissionDialog, setRevokePermissionDialog] = useState<Consent | null>(null);
  const [grantPermissionDialog, setGrantPermissionDialog] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [newConsentData, setNewConsentData] = useState({
    grantedTo: "",
    purpose: "",
    expires: "",
    customPermissions: [] as string[]
  });

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
                    <h3 className="text-lg font-semibold text-gray-900">Authorization Management</h3>
                    <Badge className="bg-blue-100 text-blue-800">Admin Mode</Badge>
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
                                onClick={() => setModifyPermissionDialog(consent)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Modify
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => setRevokePermissionDialog(consent)}
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
                      <p className="text-xs text-blue-600 mt-1">Due in 2 weeks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Great Progress!</p>
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
      <Dialog open={!!modifyPermissionDialog} onOpenChange={() => setModifyPermissionDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2 text-health-primary" />
              Modify Permissions
            </DialogTitle>
            <DialogDescription>
              Modify permissions for {modifyPermissionDialog?.scope} granted to {modifyPermissionDialog?.grantedTo}
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
                <Label className="text-sm font-medium mb-3 block">Current Permissions</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={`modify-${permission}`}
                        defaultChecked={modifyPermissionDialog.permissions.includes(permission)}
                      />
                      <Label
                        htmlFor={`modify-${permission}`}
                        className="text-sm"
                      >
                        {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
      <Dialog open={!!revokePermissionDialog} onOpenChange={() => setRevokePermissionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <X className="w-5 h-5 mr-2" />
              Revoke Permissions
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke permissions for {revokePermissionDialog?.scope}?
            </DialogDescription>
          </DialogHeader>
          {revokePermissionDialog && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">This will revoke the following permissions:</h4>
                <div className="grid grid-cols-1 gap-1">
                  {revokePermissionDialog.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center text-sm text-red-700">
                      <X className="w-3 h-3 mr-2 flex-shrink-0" />
                      {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                  ))}
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
                  This action cannot be undone. The user will need to request new permissions.
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
      <Dialog open={grantPermissionDialog} onOpenChange={setGrantPermissionDialog}>
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
              <Label className="text-sm font-medium mb-3 block">Quick Templates</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-colors ${
                      selectedTemplate === template.id 
                        ? 'border-health-primary bg-health-primary/5' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setSelectedPermissions(template.permissions);
                    }}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.permissions.slice(0, 3).map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-xs">
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
                  onChange={(e) => setNewConsentData({...newConsentData, grantedTo: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expiresDate">Expires</Label>
                <Input
                  id="expiresDate"
                  type="date"
                  value={newConsentData.expires}
                  onChange={(e) => setNewConsentData({...newConsentData, expires: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purposeText">Purpose</Label>
              <Textarea
                id="purposeText"
                placeholder="Describe the purpose for these permissions..."
                value={newConsentData.purpose}
                onChange={(e) => setNewConsentData({...newConsentData, purpose: e.target.value})}
                className="h-20"
              />
            </div>

            {/* Custom Permissions */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Custom Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grant-${permission}`}
                      checked={selectedPermissions.includes(permission)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPermissions([...selectedPermissions, permission]);
                        } else {
                          setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
                        }
                      }}
                    />
                    <Label
                      htmlFor={`grant-${permission}`}
                      className="text-sm"
                    >
                      {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                    <Badge key={permission} className="bg-health-primary text-white">
                      {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                setNewConsentData({ grantedTo: "", purpose: "", expires: "", customPermissions: [] });
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-health-primary hover:bg-health-primary/90"
              disabled={!newConsentData.grantedTo || !newConsentData.purpose || selectedPermissions.length === 0}
            >
              Grant Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
