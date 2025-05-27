
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, CheckSquare, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  projectCode: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  actualProgress: number;
  plannedProgress: number;
  contractValue: number;
  actualRevenue: number;
  projectManager: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  taskCount: number;
  completedTasks: number;
}

interface ProjectViewProps {
  clientId?: string;
  onSelectProject: (projectName: string) => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ clientId, onSelectProject }) => {
  // Mock project data - in production, this would be filtered by client from Dataverse
  const projects: Project[] = [
    {
      id: 'proj1',
      name: 'Refinery Modernization Phase 1',
      projectCode: 'EPC-REF-001',
      status: 'In Progress',
      startDate: '2024-01-15',
      endDate: '2025-06-30',
      actualProgress: 65,
      plannedProgress: 70,
      contractValue: 15000000,
      actualRevenue: 9750000,
      projectManager: 'Ahmed Hassan',
      riskLevel: 'Medium',
      taskCount: 45,
      completedTasks: 29
    },
    {
      id: 'proj2',
      name: 'Pipeline Installation - East Block',
      projectCode: 'EPC-PIP-002',
      status: 'In Progress',
      startDate: '2024-03-01',
      endDate: '2024-12-15',
      actualProgress: 80,
      plannedProgress: 75,
      contractValue: 8000000,
      actualRevenue: 6400000,
      projectManager: 'Sarah Mohamed',
      riskLevel: 'Low',
      taskCount: 32,
      completedTasks: 26
    },
    {
      id: 'proj3',
      name: 'Storage Tank Maintenance',
      projectCode: 'EPC-STG-003',
      status: 'On Hold',
      startDate: '2024-02-10',
      endDate: '2024-08-20',
      actualProgress: 40,
      plannedProgress: 60,
      contractValue: 5000000,
      actualRevenue: 2000000,
      projectManager: 'Omar Farouk',
      riskLevel: 'High',
      taskCount: 28,
      completedTasks: 11
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressVariance = (actual: number, planned: number) => {
    const variance = actual - planned;
    return {
      value: variance,
      color: variance >= 0 ? 'text-green-600' : 'text-red-600',
      symbol: variance >= 0 ? '+' : ''
    };
  };

  const formatCurrency = (amount: number) => {
    return `${(amount / 1000000).toFixed(1)}M EGP`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((project) => {
          const progressVariance = getProgressVariance(project.actualProgress, project.plannedProgress);
          
          return (
            <Card 
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-red-300"
              onClick={() => onSelectProject(project.name)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-800 text-sm leading-tight">{project.name}</h3>
                      <p className="text-xs text-gray-600">{project.projectCode}</p>
                      <p className="text-xs text-gray-500">{project.projectManager}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge className={getRiskColor(project.riskLevel)} variant="outline">
                      {project.riskLevel}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-sm font-bold text-blue-800">{project.taskCount}</div>
                      <div className="text-xs text-gray-600">Total Tasks</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-sm font-bold text-green-600">{project.completedTasks}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progress</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{project.actualProgress}%</span>
                        <span className={`text-xs ${progressVariance.color}`}>
                          ({progressVariance.symbol}{progressVariance.value}%)
                        </span>
                      </div>
                    </div>
                    <Progress value={project.actualProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Planned: {project.plannedProgress}%</span>
                      <span>Actual: {project.actualProgress}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Contract Value
                      </span>
                      <span className="font-medium text-blue-800">
                        {formatCurrency(project.contractValue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(project.actualRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        End Date
                      </span>
                      <span className="text-sm">{formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-red-50 hover:border-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project.name);
                    }}
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    View Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Project Portfolio Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Project Portfolio Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{projects.length}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'In Progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(projects.reduce((sum, p) => sum + p.actualProgress, 0) / projects.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg. Progress</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(projects.reduce((sum, p) => sum + p.contractValue, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {projects.filter(p => p.riskLevel === 'High').length}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectView;
