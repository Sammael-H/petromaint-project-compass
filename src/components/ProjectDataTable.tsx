import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Calendar,
  MapPin,
  Building,
  User
} from 'lucide-react';

interface ProjectData {
  id: number;
  projectManager: string;
  projectCode: string;
  projectName: string;
  projectType: string;
  projectSize: string;
  country: string;
  region: string;
  city: string;
  siteManager: string;
  clientCode: string;
  clientName: string;
  industry: string;
  facilityType: string;
  facilitySubtype: string;
  projectStatus: string;
  location: string;
  duration: number;
  currentDate: string;
  contractDate: string;
  siteReceiptDate: string;
  startDate: string;
  endDate: string;
  actualCompletionDate?: string;
  actualProgress: number;
  plannedProgress: number;
  progressVariance: number;
  completionRate: number;
  status: string;
  scheduleStatus: string;
  healthStatus: string;
  contractValue: number;
  actualRevenue: number;
  plannedRevenue: number;
  revenueVariance: number;
  budgetUtilization: number;
  budgetStatus: string;
  totalBudget: number;
  spentBudget: number;
  remainingBudget: number;
  totalValue: number;
  riskLevel: string;
  recommendation: string;
  notes: string;
}

const ProjectDataTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');

  // Project data from the provided information
  const projectData: ProjectData[] = [
    {
      id: 1,
      projectManager: "Eng. Mohamed Mousa",
      projectCode: "10273663001",
      projectName: "Firefighting Works Contract No. (10/2022)",
      projectType: "Standalone Projects",
      projectSize: "Large",
      country: "Egypt",
      region: "Nile Delta",
      city: "Port Said",
      siteManager: "Eng. Islam Karaweih",
      clientCode: "1027",
      clientName: "BURULLUS GAS CO.",
      industry: "Gas",
      facilityType: "Midstream / Storage",
      facilitySubtype: "Gas Tank",
      projectStatus: "Brownfield",
      location: "Onshore",
      duration: 779,
      currentDate: "24/01/2025",
      contractDate: "13/11/2022",
      siteReceiptDate: "03/01/2024",
      startDate: "13/11/2022",
      endDate: "31/12/2024",
      actualProgress: 18,
      plannedProgress: 98,
      progressVariance: -80,
      completionRate: 18.37,
      status: "In progress",
      scheduleStatus: "Overdue",
      healthStatus: "PROGRESS HALTED",
      contractValue: 96408000,
      actualRevenue: 11548206,
      plannedRevenue: 17353440,
      revenueVariance: -5805234,
      budgetUtilization: 66.5,
      budgetStatus: "OVER",
      totalBudget: 95420048.51,
      spentBudget: 17353440,
      remainingBudget: 11548206,
      totalValue: 96408000,
      riskLevel: "High",
      recommendation: "Increase resources, expedite critical tasks, negotiate deadline extension, perform risk reassessment",
      notes: "Only the first phase has been received, and its paints have been supplied. It will be completed by 31/12/2024 to deliver the project to the client."
    },
    {
      id: 2,
      projectManager: "Eng. Mohamed Mousa",
      projectCode: "10274103001",
      projectName: "Works for Changing Control Devices of Central Air Conditioning Systems at the Fields of Burullus Company (2024/010)",
      projectType: "Standalone Projects",
      projectSize: "Small",
      country: "Egypt",
      region: "Nile Delta",
      city: "Port Said",
      siteManager: "Eng. Islam Karaweih",
      clientCode: "1027",
      clientName: "BURULLUS GAS CO.",
      industry: "Gas",
      facilityType: "Downstream",
      facilitySubtype: "Gas Processing Plant",
      projectStatus: "Brownfield",
      location: "Onshore",
      duration: 365,
      currentDate: "24/01/2025",
      contractDate: "30/09/2024",
      siteReceiptDate: "09/03/2024",
      startDate: "30/09/2024",
      endDate: "30/09/2025",
      actualProgress: 0,
      plannedProgress: 0,
      progressVariance: 0,
      completionRate: 0,
      status: "Not started",
      scheduleStatus: "On time",
      healthStatus: "HEALTHY",
      contractValue: 6300000,
      actualRevenue: 0,
      plannedRevenue: 0,
      revenueVariance: 0,
      budgetUtilization: 0,
      budgetStatus: "ON",
      totalBudget: 0,
      spentBudget: 0,
      remainingBudget: 0,
      totalValue: 6300000,
      riskLevel: "Low",
      recommendation: "Continue regular monitoring, ensure resources are allocated efficiently",
      notes: "Duration of the operation: One Gregorian year. The works have been assigned to the contractor 'Aircom'. We are awaiting the receipt of the unprepared site from the client."
    },
    {
      id: 3,
      projectManager: "Eng. Mohamed Mousa",
      projectCode: "20254064001",
      projectName: "Sandblasting and Painting Works (2024-2027) (Work Order - 2300113)",
      projectType: "Standalone Projects",
      projectSize: "Large",
      country: "Egypt",
      region: "Nile Delta",
      city: "Port Said",
      siteManager: "Eng. Ibrahim Abdel-Shafy",
      clientCode: "2025",
      clientName: "Egyptian Propylene & Polypropylene Co.",
      industry: "Chemical",
      facilityType: "Production",
      facilitySubtype: "Petrochemical Plant",
      projectStatus: "Brownfield",
      location: "Onshore",
      duration: 1039,
      currentDate: "24/01/2025",
      contractDate: "16/07/2024",
      siteReceiptDate: "09/09/2024",
      startDate: "09/09/2024",
      endDate: "15/07/2027",
      actualProgress: 4,
      plannedProgress: 7,
      progressVariance: -3,
      completionRate: 57.14,
      status: "In progress",
      scheduleStatus: "Behind",
      healthStatus: "PROGRESS HALTED",
      contractValue: 29025000,
      actualRevenue: 0,
      plannedRevenue: 1161000,
      revenueVariance: -1161000,
      budgetUtilization: 0,
      budgetStatus: "OVER",
      totalBudget: 1478594.38,
      spentBudget: 1161000,
      remainingBudget: 0,
      totalValue: 29025000,
      riskLevel: "Medium",
      recommendation: "Monitor closely, allocate additional resources if needed, reassess task priorities",
      notes: "Contract Status: 3 years from the date of receipt of the assignment order dated 16/07/2024. The site was received on 09/09/2024."
    }
    // Additional projects can be added here following the same pattern
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'completed':
        return <Badge className="bg-green-100 text-status-on-time border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Complete</Badge>;
      case 'in progress':
        return <Badge className="bg-blue-100 text-brand-primary border-blue-300"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'not started':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Not Started</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-brand-accent-red border-red-300"><AlertTriangle className="w-3 h-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-300">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return <Badge className="bg-green-100 text-status-on-time border-green-300">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-brand-accent-yellow border-yellow-300">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-brand-accent-red border-red-300"><AlertTriangle className="w-3 h-3 mr-1" />High Risk</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-300">{risk}</Badge>;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health.toLowerCase()) {
      case 'healthy':
        return <Badge className="bg-green-100 text-status-on-time border-green-300">Healthy</Badge>;
      case 'at risk':
        return <Badge className="bg-yellow-100 text-brand-accent-yellow border-yellow-300">At Risk</Badge>;
      case 'progress halted':
        return <Badge className="bg-red-100 text-brand-accent-red border-red-300">Progress Halted</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-300">{health}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '0:00') return 'N/A';
    try {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        return date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const filteredData = projectData.filter(project => {
    const matchesSearch = project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || project.status === filterStatus;
    const matchesRisk = filterRisk === 'All' || project.riskLevel === filterRisk;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center text-brand-primary">
              <Building className="w-5 h-5 mr-2" />
              Petromaint Project Portfolio - Detailed Data
            </span>
            <Button size="sm" className="bg-brand-accent-red hover:bg-red-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects, clients, or codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-brand-accent-red"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-brand-accent-red focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="In progress">In Progress</option>
                <option value="Complete">Complete</option>
                <option value="Not started">Not Started</option>
              </select>
              <select 
                value={filterRisk} 
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-brand-accent-red focus:outline-none"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
              <div className="text-2xl font-bold text-brand-primary">{projectData.length}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
              <div className="text-2xl font-bold text-status-on-time">
                {projectData.filter(p => p.status === 'In progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
              <div className="text-2xl font-bold text-brand-accent-yellow">
                {formatCurrency(projectData.reduce((sum, p) => sum + p.contractValue, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Contract Value</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
              <div className="text-2xl font-bold text-brand-accent-red">
                {projectData.filter(p => p.riskLevel === 'High').length}
              </div>
              <div className="text-sm text-gray-600">High Risk Projects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-gray-200">
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead className="min-w-48">Project Details</TableHead>
                  <TableHead className="min-w-40">Client & Location</TableHead>
                  <TableHead className="min-w-32">Timeline</TableHead>
                  <TableHead className="min-w-32">Progress</TableHead>
                  <TableHead className="min-w-40">Financial</TableHead>
                  <TableHead className="min-w-32">Status & Risk</TableHead>
                  <TableHead className="min-w-64">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50 border-gray-200">
                    <TableCell className="font-medium">{project.id}</TableCell>
                    
                    {/* Project Details */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-brand-primary text-sm leading-tight">
                          {project.projectName}
                        </div>
                        <div className="text-xs text-gray-600">{project.projectCode}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          {project.projectManager}
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-300">
                          {project.projectSize} - {project.projectType}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Client & Location */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{project.clientName}</div>
                        <div className="text-xs text-gray-600">{project.clientCode}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {project.city}, {project.country}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.industry} - {project.facilityType}
                        </div>
                      </div>
                    </TableCell>

                    {/* Timeline */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="font-medium">Start:</span>
                        </div>
                        <div className="text-xs">{formatDate(project.startDate)}</div>
                        <div className="flex items-center text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span className="font-medium">End:</span>
                        </div>
                        <div className="text-xs">{formatDate(project.endDate)}</div>
                        <div className="text-xs text-gray-500">{project.duration} days</div>
                      </div>
                    </TableCell>

                    {/* Progress */}
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Actual:</span>
                          <span className="font-medium">{project.actualProgress}%</span>
                        </div>
                        <Progress value={project.actualProgress} className="h-2" />
                        <div className="flex justify-between text-xs">
                          <span>Planned:</span>
                          <span>{project.plannedProgress}%</span>
                        </div>
                        <div className={`text-xs ${project.progressVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          Variance: {project.progressVariance > 0 ? '+' : ''}{project.progressVariance}%
                        </div>
                      </div>
                    </TableCell>

                    {/* Financial */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <DollarSign className="w-3 h-3 mr-1" />
                          <span className="font-medium">Contract:</span>
                        </div>
                        <div className="text-xs font-medium text-blue-800">
                          {formatCurrency(project.contractValue)}
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-600">Revenue:</span>
                          <div className="font-medium text-green-600">
                            {formatCurrency(project.actualRevenue)}
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-600">Utilization:</span>
                          <span className="font-medium">{project.budgetUtilization}%</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status & Risk */}
                    <TableCell>
                      <div className="space-y-2">
                        {getStatusBadge(project.status)}
                        {getRiskBadge(project.riskLevel)}
                        {getHealthBadge(project.healthStatus)}
                        <div className="text-xs">
                          <Badge variant="outline" className={
                            project.scheduleStatus === 'On time' ? 'border-green-300 text-status-on-time' :
                            project.scheduleStatus === 'Behind' ? 'border-yellow-300 text-brand-accent-yellow' :
                            'border-red-300 text-brand-accent-red'
                          }>
                            {project.scheduleStatus}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>

                    {/* Notes */}
                    <TableCell>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-blue-800">Recommendation:</div>
                        <div className="text-xs text-gray-700">{project.recommendation}</div>
                        {project.notes && (
                          <>
                            <div className="text-xs font-medium text-gray-800">Notes:</div>
                            <div className="text-xs text-gray-600 line-clamp-3">{project.notes}</div>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No projects found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDataTable;
