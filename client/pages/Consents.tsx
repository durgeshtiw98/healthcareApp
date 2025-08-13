import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Key,
  Share,
  Download,
  Upload,
  Settings,
  Users,
  FileText,
  Activity,
  Bell,
  Hash,
  Link2,
  Globe,
  Building2,
  Stethoscope,
  TestTube,
  Pill,
  Heart,
  Phone,
  Video,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
  History,
  Zap,
  Database,
  Fingerprint
} from "lucide-react";

interface Consent {
  id: string;
  consentId: string;
  title: string;
  scope: string;
  grantedTo: {
    name: string;
    type: "clinician" | "facility" | "lab" | "pharmacy" | "family" | "emergency" | "research";
    organization?: string;
  };
  patient: {
    id: string;
    name: string;
    mrn: string;
  };
  purpose: string;
  status: "active" | "expired" | "revoked" | "pending";
  priority: "critical" | "high" | "medium" | "low";
  createdDate: string;
  expiryDate: string;
  lastAccessed?: string;
  accessCount: number;
  permissions: string[];
  conditions: string[];
  blockchainHash: string;
  blockHeight: number;
  revokeReason?: string;
}

interface ConsentTemplate {
  id: string;
  name: string;
  description: string;
  scope: string;
  defaultDuration: string;
  permissions: string[];
  icon: any;
  color: string;
}

export default function Consents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedConsent, setSelectedConsent] = useState<Consent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ConsentTemplate | null>(null);

  const consents: Consent[] = [
    {
      id: "C-001",
      consentId: "CON-2024-001",
      title: "Emergency Medical Access",
      scope: "Emergency Access",
      grantedTo: {
        name: "Emergency Department",
        type: "emergency",
        organization: "Metro General Hospital"
      },
      patient: {
        id: "P-001",
        name: "Maria Rodriguez",
        mrn: "MRN-2024-001"
      },
      purpose: "Emergency medical treatment and life-saving interventions",
      status: "active",
      priority: "critical",
      createdDate: "2024-01-01",
      expiryDate: "2024-12-31",
      lastAccessed: "2024-01-15",
      accessCount: 3,
      permissions: ["vitals", "allergies", "current_medications", "medical_history", "emergency_contacts"],
      conditions: ["24_hour_access", "break_glass_protocol", "automatic_audit"],
      blockchainHash: "0x4a7b...9f2e",
      blockHeight: 2567890
    },
    {
      id: "C-002",
      consentId: "CON-2024-002",
      title: "Primary Care Provider Access",
      scope: "Treating Clinician",
      grantedTo: {
        name: "Dr. Sarah Johnson",
        type: "clinician",
        organization: "Metro Health Center"
      },
      patient: {
        id: "P-001",
        name: "Maria Rodriguez",
        mrn: "MRN-2024-001"
      },
      purpose: "Comprehensive diabetes management and ongoing care",
      status: "active",
      priority: "high",
      createdDate: "2024-01-15",
      expiryDate: "2024-07-15",
      lastAccessed: "2024-01-14",
      accessCount: 28,
      permissions: ["full_episode_access", "read_write_notes", "order_labs", "prescribe_medications", "view_imaging", "schedule_appointments"],
      conditions: ["business_hours_only", "purpose_limitation", "data_minimization"],
      blockchainHash: "0x8b3c...4d1a",
      blockHeight: 2567891
    },
    {
      id: "C-003",
      consentId: "CON-2024-003",
      title: "Laboratory Services",
      scope: "Lab Access",
      grantedTo: {
        name: "Quest Diagnostics",
        type: "lab",
        organization: "Quest Diagnostics Inc."
      },
      patient: {
        id: "P-001",
        name: "Maria Rodriguez",
        mrn: "MRN-2024-001"
      },
      purpose: "Laboratory testing, result reporting, and quality assurance",
      status: "active",
      priority: "medium",
      createdDate: "2024-01-20",
      expiryDate: "2024-04-20",
      lastAccessed: "2024-01-13",
      accessCount: 5,
      permissions: ["read_lab_orders", "write_results", "upload_reports", "quality_control"],
      conditions: ["specific_tests_only", "secure_transmission", "result_notification"],
      blockchainHash: "0x9e5f...7c8b",
      blockHeight: 2567892
    },
    {
      id: "C-004",
      consentId: "CON-2024-004",
      title: "Family Member Dashboard",
      scope: "Family Access",
      grantedTo: {
        name: "John Rodriguez (Spouse)",
        type: "family",
        organization: "Family Member"
      },
      patient: {
        id: "P-001",
        name: "Maria Rodriguez",
        mrn: "MRN-2024-001"
      },
      purpose: "Health monitoring, appointment tracking, and emergency notifications",
      status: "active",
      priority: "low",
      createdDate: "2024-01-10",
      expiryDate: "2025-01-10",
      lastAccessed: "2024-01-12",
      accessCount: 15,
      permissions: ["read_vitals", "view_appointments", "emergency_notifications", "medication_reminders"],
      conditions: ["read_only_access", "summary_data_only", "emergency_override"],
      blockchainHash: "0x2f8a...6e9d",
      blockHeight: 2567893
    },
    {
      id: "C-005",
      consentId: "CON-2023-089",
      title: "Pharmacy Prescription Access",
      scope: "Pharmacy Access",
      grantedTo: {
        name: "CVS Pharmacy #1247",
        type: "pharmacy",
        organization: "CVS Health Corporation"
      },
      patient: {
        id: "P-001",
        name: "Maria Rodriguez",
        mrn: "MRN-2024-001"
      },
      purpose: "Prescription verification, dispensing, and drug interaction checking",
      status: "expired",
      priority: "medium",
      createdDate: "2023-10-15",
      expiryDate: "2024-01-15",
      lastAccessed: "2024-01-14",
      accessCount: 12,
      permissions: ["read_prescriptions", "verify_dosage", "check_interactions", "dispense_medication"],
      conditions: ["prescription_specific", "interaction_alerts", "secure_dispensing"],
      blockchainHash: "0x1c4d...8a7f",
      blockHeight: 2545123
    }
  ];

  const consentTemplates: ConsentTemplate[] = [
    {
      id: "emergency",
      name: "Emergency Access",
      description: "24/7 access for emergency medical situations",
      scope: "Emergency Department",
      defaultDuration: "1 year",
      permissions: ["vitals", "allergies", "medications", "history"],
      icon: AlertTriangle,
      color: "from-red-500 to-red-600"
    },
    {
      id: "clinician",
      name: "Primary Care Provider",
      description: "Comprehensive access for ongoing treatment",
      scope: "Treating Clinician",
      defaultDuration: "6 months",
      permissions: ["full_access", "read_write", "prescribe", "order_tests"],
      icon: Stethoscope,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "specialist",
      name: "Specialist Referral",
      description: "Limited access for specialized care",
      scope: "Specialist",
      defaultDuration: "3 months",
      permissions: ["episode_specific", "read_write", "order_tests"],
      icon: User,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "lab",
      name: "Laboratory Services",
      description: "Access for lab testing and results",
      scope: "Laboratory",
      defaultDuration: "3 months",
      permissions: ["read_orders", "write_results", "upload_reports"],
      icon: TestTube,
      color: "from-green-500 to-green-600"
    },
    {
      id: "pharmacy",
      name: "Pharmacy Access",
      description: "Prescription verification and dispensing",
      scope: "Pharmacy",
      defaultDuration: "1 year",
      permissions: ["read_prescriptions", "verify_dosage", "dispense"],
      icon: Pill,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: "family",
      name: "Family Member",
      description: "Limited dashboard access for family",
      scope: "Family",
      defaultDuration: "1 year",
      permissions: ["read_vitals", "appointments", "notifications"],
      icon: Heart,
      color: "from-pink-500 to-pink-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired": return "bg-red-100 text-red-800 border-red-200";
      case "revoked": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "clinician": return Stethoscope;
      case "facility": return Building2;
      case "lab": return TestTube;
      case "pharmacy": return Pill;
      case "family": return Heart;
      case "emergency": return AlertTriangle;
      case "research": return Database;
      default: return User;
    }
  };

  const filteredConsents = consents.filter(consent => {
    const matchesSearch = consent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consent.grantedTo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consent.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || consent.status === statusFilter;
    const matchesType = typeFilter === "all" || consent.grantedTo.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    totalConsents: consents.length,
    activeConsents: consents.filter(c => c.status === 'active').length,
    expiredConsents: consents.filter(c => c.status === 'expired').length,
    totalAccesses: consents.reduce((sum, c) => sum + c.accessCount, 0)
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-health-primary" />
              Consent Management
            </h1>
            <p className="text-gray-600 mt-2">Patient-controlled access with blockchain security</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              Audit Log
            </Button>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-health-primary hover:bg-health-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Grant Consent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Grant New Consent</DialogTitle>
                  <DialogDescription>
                    Create a new consent with specific permissions and conditions
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="templates" className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="templates">Quick Templates</TabsTrigger>
                    <TabsTrigger value="custom">Custom Consent</TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {consentTemplates.map((template) => {
                        const IconComponent = template.icon;
                        return (
                          <Card 
                            key={template.id} 
                            className={`cursor-pointer hover:shadow-md transition-all ${
                              selectedTemplate?.id === template.id ? 'ring-2 ring-health-primary' : ''
                            }`}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${template.color} rounded-lg flex items-center justify-center`}>
                                  <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                  <p className="text-sm text-gray-600">{template.scope}</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                              <div className="text-xs text-gray-500">
                                Duration: {template.defaultDuration}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    
                    {selectedTemplate && (
                      <Card className="border-health-primary/20 bg-health-primary/5">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Selected: {selectedTemplate.name}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipient">Grant Access To</Label>
                              <Input id="recipient" placeholder="Provider or organization name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="duration">Access Duration</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder={selectedTemplate.defaultDuration} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1week">1 Week</SelectItem>
                                  <SelectItem value="1month">1 Month</SelectItem>
                                  <SelectItem value="3months">3 Months</SelectItem>
                                  <SelectItem value="6months">6 Months</SelectItem>
                                  <SelectItem value="1year">1 Year</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="purpose">Purpose of Access</Label>
                              <Textarea id="purpose" placeholder="Describe the medical purpose for this consent" />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button className="bg-health-primary hover:bg-health-primary/90">
                              Grant Consent
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="custom-title">Consent Title</Label>
                        <Input id="custom-title" placeholder="e.g., Specialist Cardiology Access" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-recipient">Grant Access To</Label>
                        <Input id="custom-recipient" placeholder="Provider or organization name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-type">Access Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinician">Clinician</SelectItem>
                            <SelectItem value="facility">Healthcare Facility</SelectItem>
                            <SelectItem value="lab">Laboratory</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="family">Family Member</SelectItem>
                            <SelectItem value="research">Research</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custom-priority">Priority Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="custom-purpose">Purpose</Label>
                        <Textarea id="custom-purpose" placeholder="Detailed purpose and justification" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Permissions</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          "Read Medical History", "Write Clinical Notes", "Order Laboratory Tests",
                          "Prescribe Medications", "View Imaging Results", "Schedule Appointments",
                          "Emergency Access", "Share with Specialists", "Export Data"
                        ].map((permission, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox id={`perm-${index}`} />
                            <Label htmlFor={`perm-${index}`} className="text-sm">{permission}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-health-primary hover:bg-health-primary/90">
                        Create Custom Consent
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Consents</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalConsents}</p>
                </div>
                <div className="w-12 h-12 bg-health-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-health-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Consents</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeConsents}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expired</p>
                  <p className="text-3xl font-bold text-red-600">{stats.expiredConsents}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Accesses</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalAccesses}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search consents, providers, or purposes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="clinician">Clinician</SelectItem>
                    <SelectItem value="facility">Facility</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredConsents.map((consent) => {
            const IconComponent = getTypeIcon(consent.grantedTo.type);
            return (
              <Card key={consent.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {consent.consentId}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(consent.priority)}`} />
                        <Badge className={getStatusColor(consent.status)}>
                          {consent.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-1">{consent.title}</CardTitle>
                      <CardDescription className="mt-1 flex items-center">
                        <IconComponent className="w-4 h-4 mr-2" />
                        {consent.grantedTo.name}
                        {consent.grantedTo.organization && (
                          <span className="ml-1 text-xs">• {consent.grantedTo.organization}</span>
                        )}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Purpose</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{consent.purpose}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Created</p>
                        <p className="font-medium">{consent.createdDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expires</p>
                        <p className="font-medium">{consent.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Accessed</p>
                        <p className="font-medium">{consent.lastAccessed || 'Never'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Access Count</p>
                        <p className="font-medium">{consent.accessCount}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Permissions ({consent.permissions.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {consent.permissions.slice(0, 3).map((permission, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {permission.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {consent.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{consent.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <Hash className="w-3 h-3 mr-1" />
                        Blockchain: {consent.blockchainHash}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Database className="w-3 h-3 mr-1" />
                        Block: #{consent.blockHeight}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1" onClick={() => setSelectedConsent(consent)}>
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {consent.status === 'active' && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Modify
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => {
                              setSelectedConsent(consent);
                              setIsRevokeDialogOpen(true);
                            }}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Revoke
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredConsents.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No consents found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters, or grant a new consent.
              </p>
              <Button className="bg-health-primary hover:bg-health-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Grant New Consent
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Consent Details Modal */}
        {selectedConsent && !isRevokeDialogOpen && (
          <Dialog open={!!selectedConsent} onOpenChange={() => setSelectedConsent(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  {selectedConsent.title}
                </DialogTitle>
                <DialogDescription>
                  Consent {selectedConsent.consentId} • {selectedConsent.grantedTo.name}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                  <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Consent Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Scope</label>
                          <p className="text-gray-900">{selectedConsent.scope}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Purpose</label>
                          <p className="text-gray-900">{selectedConsent.purpose}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <Badge className={getStatusColor(selectedConsent.status)}>
                            {selectedConsent.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Priority</label>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedConsent.priority)}`} />
                            <span className="capitalize">{selectedConsent.priority}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Access Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Granted To</label>
                          <p className="text-gray-900">{selectedConsent.grantedTo.name}</p>
                          <p className="text-sm text-gray-600">{selectedConsent.grantedTo.organization}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Type</label>
                          <p className="text-gray-900 capitalize">{selectedConsent.grantedTo.type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Access Count</label>
                          <p className="text-gray-900">{selectedConsent.accessCount} times</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Last Accessed</label>
                          <p className="text-gray-900">{selectedConsent.lastAccessed || 'Never'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Created Date</label>
                          <p className="text-gray-900">{selectedConsent.createdDate}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                          <p className="text-gray-900">{selectedConsent.expiryDate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Granted Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedConsent.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-gray-900">
                              {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conditions & Restrictions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedConsent.conditions.map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900">
                              {condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="blockchain" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        Blockchain Record
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Transaction Hash</label>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedConsent.blockchainHash}</code>
                            <Button variant="ghost" size="sm">
                              <Link2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Block Height</label>
                          <p className="text-gray-900">#{selectedConsent.blockHeight}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">Blockchain Verified</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          This consent is cryptographically secured and immutably recorded on the blockchain.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="audit" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Access Audit Trail</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { date: "2024-01-14", action: "Data Accessed", details: "Patient records viewed for routine checkup" },
                          { date: "2024-01-10", action: "Prescription Ordered", details: "Metformin prescription created" },
                          { date: "2024-01-08", action: "Lab Results Viewed", details: "HbA1c test results reviewed" },
                          { date: "2024-01-05", action: "Data Accessed", details: "Medical history reviewed for treatment planning" }
                        ].map((entry, index) => (
                          <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-3 h-3 bg-health-primary rounded-full mt-2" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">{entry.action}</p>
                                <time className="text-sm text-gray-500">{entry.date}</time>
                              </div>
                              <p className="text-sm text-gray-600">{entry.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}

        {/* Revoke Consent Dialog */}
        <Dialog open={isRevokeDialogOpen} onOpenChange={setIsRevokeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Revoke Consent
              </DialogTitle>
              <DialogDescription>
                This action will immediately revoke all access permissions. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-medium text-red-900">
                  {selectedConsent?.title}
                </p>
                <p className="text-sm text-red-700">
                  Granted to: {selectedConsent?.grantedTo.name}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revoke-reason">Reason for Revocation</Label>
                <Textarea id="revoke-reason" placeholder="Please provide a reason for revoking this consent..." />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsRevokeDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive">
                Revoke Consent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
