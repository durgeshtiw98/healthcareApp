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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Stethoscope,
  Clock,
  MapPin,
  Activity,
  Heart,
  TestTube,
  Pill,
  Camera,
  Upload,
  Download,
  Share,
  Eye,
  Edit,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Archive,
  Trash2,
  ChevronRight,
  Timeline,
  Building2,
  CalendarDays,
  FileImage,
  FileX,
  Paperclip,
} from "lucide-react";

interface Episode {
  id: string;
  title: string;
  diagnosis: string;
  icdCode: string;
  status: "active" | "completed" | "suspended" | "archived";
  priority: "low" | "medium" | "high" | "critical";
  startDate: string;
  endDate?: string;
  patient: {
    id: string;
    name: string;
    age: number;
    mrn: string;
  };
  provider: {
    name: string;
    specialty: string;
  };
  facility: {
    name: string;
    department: string;
  };
  visits: number;
  artifacts: number;
  lastActivity: string;
  description: string;
  tags: string[];
}

interface Artifact {
  id: string;
  type:
    | "lab_result"
    | "imaging"
    | "document"
    | "note"
    | "prescription"
    | "vitals";
  title: string;
  date: string;
  size?: string;
  provider: string;
  status: "pending" | "available" | "reviewed";
}

export default function Episodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const episodes: Episode[] = [
    {
      id: "EP-2024-001",
      title: "Acute Myocardial Infarction Management",
      diagnosis: "ST-Elevation Myocardial Infarction",
      icdCode: "I21.9",
      status: "active",
      priority: "critical",
      startDate: "2024-01-15",
      patient: {
        id: "P-001",
        name: "Maria Rodriguez",
        age: 58,
        mrn: "MRN-2024-001",
      },
      provider: {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
      },
      facility: {
        name: "Metro Heart Center",
        department: "CCU",
      },
      visits: 8,
      artifacts: 24,
      lastActivity: "2 hours ago",
      description:
        "Patient presented with chest pain and elevated cardiac enzymes. Emergent PCI performed with drug-eluting stent placement.",
      tags: ["cardiac", "emergency", "interventional"],
    },
    {
      id: "EP-2024-002",
      title: "Type 2 Diabetes Management",
      diagnosis: "Type 2 Diabetes Mellitus",
      icdCode: "E11.9",
      status: "active",
      priority: "medium",
      startDate: "2024-02-20",
      patient: {
        id: "P-002",
        name: "John Thompson",
        age: 45,
        mrn: "MRN-2024-002",
      },
      provider: {
        name: "Dr. Emily Chen",
        specialty: "Endocrinology",
      },
      facility: {
        name: "Metro Health Center",
        department: "Endocrinology",
      },
      visits: 5,
      artifacts: 18,
      lastActivity: "1 day ago",
      description:
        "Newly diagnosed Type 2 diabetes with poor glycemic control. Initiating combination therapy and lifestyle modifications.",
      tags: ["chronic", "diabetes", "metabolic"],
    },
    {
      id: "EP-2024-003",
      title: "Post-Operative Hip Replacement Recovery",
      diagnosis: "Total Hip Replacement Recovery",
      icdCode: "Z96.641",
      status: "active",
      priority: "low",
      startDate: "2024-03-10",
      patient: {
        id: "P-003",
        name: "Sarah Chen",
        age: 72,
        mrn: "MRN-2024-003",
      },
      provider: {
        name: "Dr. Michael Davis",
        specialty: "Orthopedics",
      },
      facility: {
        name: "Metro Surgical Center",
        department: "Orthopedics",
      },
      visits: 3,
      artifacts: 12,
      lastActivity: "3 days ago",
      description:
        "Successful total hip replacement. Following standard recovery protocol with physical therapy.",
      tags: ["surgical", "orthopedic", "recovery"],
    },
    {
      id: "EP-2023-045",
      title: "Hypertension Management",
      diagnosis: "Essential Hypertension",
      icdCode: "I10",
      status: "completed",
      priority: "medium",
      startDate: "2023-08-15",
      endDate: "2024-01-15",
      patient: {
        id: "P-004",
        name: "David Wilson",
        age: 55,
        mrn: "MRN-2024-004",
      },
      provider: {
        name: "Dr. Lisa Park",
        specialty: "Internal Medicine",
      },
      facility: {
        name: "Metro Health Center",
        department: "Internal Medicine",
      },
      visits: 12,
      artifacts: 35,
      lastActivity: "2 months ago",
      description:
        "Successfully managed hypertension with lifestyle modifications and ACE inhibitor therapy. Target BP achieved.",
      tags: ["cardiovascular", "chronic", "managed"],
    },
  ];

  const artifacts: Artifact[] = [
    {
      id: "A-001",
      type: "lab_result",
      title: "Troponin I",
      date: "2024-01-15",
      provider: "Lab Corp",
      status: "available",
    },
    {
      id: "A-002",
      type: "imaging",
      title: "Cardiac Catheterization",
      date: "2024-01-15",
      provider: "Dr. Johnson",
      status: "reviewed",
    },
    {
      id: "A-003",
      type: "prescription",
      title: "Metoprolol 50mg",
      date: "2024-01-16",
      provider: "Dr. Johnson",
      status: "available",
    },
    {
      id: "A-004",
      type: "note",
      title: "Discharge Summary",
      date: "2024-01-20",
      provider: "Dr. Johnson",
      status: "available",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "suspended":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case "lab_result":
        return TestTube;
      case "imaging":
        return Camera;
      case "document":
        return FileText;
      case "note":
        return FileText;
      case "prescription":
        return Pill;
      case "vitals":
        return Activity;
      default:
        return FileText;
    }
  };

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesSearch =
      episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || episode.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || episode.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-health-primary" />
              Episodes Management
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive episode tracking and care coordination
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-health-primary hover:bg-health-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Episode
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Episode</DialogTitle>
                  <DialogDescription>
                    Start a new episode for comprehensive care tracking
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="episode-title">Episode Title</Label>
                    <Input
                      id="episode-title"
                      placeholder="e.g., Diabetes Management"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                    <Input
                      id="diagnosis"
                      placeholder="e.g., Type 2 Diabetes Mellitus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icd-code">ICD-10 Code</Label>
                    <Input id="icd-code" placeholder="e.g., E11.9" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Episode description and initial assessment"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-health-primary hover:bg-health-primary/90">
                    Create Episode
                  </Button>
                </div>
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
                  <p className="text-sm font-medium text-gray-600">
                    Total Episodes
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {episodes.length}
                  </p>
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
                    Active Episodes
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {episodes.filter((e) => e.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Critical Priority
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {episodes.filter((e) => e.priority === "critical").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Artifacts
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {episodes.reduce((sum, e) => sum + e.artifacts, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Paperclip className="w-6 h-6 text-blue-600" />
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
                    placeholder="Search episodes, diagnoses, or patients..."
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Episodes Grid/List */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredEpisodes.map((episode) => (
            <Card
              key={episode.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {episode.id}
                      </Badge>
                      <div
                        className={`w-3 h-3 rounded-full ${getPriorityColor(episode.priority)}`}
                      />
                      <Badge className={getStatusColor(episode.status)}>
                        {episode.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {episode.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-1">
                      {episode.diagnosis} ({episode.icdCode})
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {episode.patient.name} (Age: {episode.patient.age})
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    {episode.provider.name} - {episode.provider.specialty}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    {episode.facility.name} - {episode.facility.department}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Started: {episode.startDate}
                    {episode.endDate && ` • Ended: ${episode.endDate}`}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Last activity: {episode.lastActivity}
                  </div>

                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {episode.visits}
                        </div>
                        <div className="text-xs text-gray-600">Visits</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {episode.artifacts}
                        </div>
                        <div className="text-xs text-gray-600">Artifacts</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {episode.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {episode.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedEpisode(episode)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEpisodes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No episodes found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters, or create a new
                episode.
              </p>
              <Button className="bg-health-primary hover:bg-health-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create New Episode
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Episode Details Modal */}
        {selectedEpisode && (
          <Dialog
            open={!!selectedEpisode}
            onOpenChange={() => setSelectedEpisode(null)}
          >
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  {selectedEpisode.title}
                </DialogTitle>
                <DialogDescription>
                  Episode {selectedEpisode.id} • {selectedEpisode.patient.name}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Episode Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Diagnosis
                          </label>
                          <p className="text-gray-900">
                            {selectedEpisode.diagnosis}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            ICD-10 Code
                          </label>
                          <p className="text-gray-900">
                            {selectedEpisode.icdCode}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Status
                          </label>
                          <Badge
                            className={getStatusColor(selectedEpisode.status)}
                          >
                            {selectedEpisode.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Priority
                          </label>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getPriorityColor(selectedEpisode.priority)}`}
                            />
                            <span className="capitalize">
                              {selectedEpisode.priority}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Care Team</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Primary Provider
                          </label>
                          <p className="text-gray-900">
                            {selectedEpisode.provider.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedEpisode.provider.specialty}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Facility
                          </label>
                          <p className="text-gray-900">
                            {selectedEpisode.facility.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedEpisode.facility.department}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {selectedEpisode.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="artifacts" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Episode Artifacts</h3>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Artifact
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {artifacts.map((artifact) => {
                      const IconComponent = getArtifactIcon(artifact.type);
                      return (
                        <Card key={artifact.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <IconComponent className="w-5 h-5 text-gray-600" />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {artifact.title}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {artifact.provider} • {artifact.date}
                                    {artifact.size && ` • ${artifact.size}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    artifact.status === "available"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {artifact.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Episode Timeline</h3>
                    <div className="space-y-4">
                      {[
                        {
                          date: "2024-01-15",
                          event: "Episode Created",
                          description: "Initial diagnosis and episode started",
                        },
                        {
                          date: "2024-01-15",
                          event: "Emergency Admission",
                          description: "Patient admitted to CCU",
                        },
                        {
                          date: "2024-01-16",
                          event: "Cardiac Catheterization",
                          description: "PCI performed with stent placement",
                        },
                        {
                          date: "2024-01-20",
                          event: "Discharge",
                          description: "Patient discharged with medications",
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-3 h-3 bg-health-primary rounded-full mt-2" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">
                                {item.event}
                              </p>
                              <time className="text-sm text-gray-500">
                                {item.date}
                              </time>
                            </div>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <h3 className="text-lg font-semibold">Episode Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Episode Status
                        </p>
                        <p className="text-sm text-gray-600">
                          Change the current status of this episode
                        </p>
                      </div>
                      <Select value={selectedEpisode.status}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Archive Episode
                        </p>
                        <p className="text-sm text-gray-600">
                          Move this episode to archives
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Layout>
  );
}
