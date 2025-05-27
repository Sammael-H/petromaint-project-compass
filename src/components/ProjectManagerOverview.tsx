
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProjectManager {
  id: string;
  name: string;
  totalProjects: number;
  activeProjects: number;
  completionRate: number;
}

interface ProjectManagerOverviewProps {
  data: ProjectManager[];
  onSelectPM: (pmName: string) => void;
}

const ProjectManagerOverview: React.FC<ProjectManagerOverviewProps> = ({ data, onSelectPM }) => {
  const getStatusColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (rate: number) => {
    if (rate >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rate >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((pm) => (
          <Card 
            key={pm.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-red-300"
            onClick={() => onSelectPM(pm.name)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">{pm.name}</h3>
                    <p className="text-sm text-gray-600">Project Manager</p>
                  </div>
                </div>
                {getStatusBadge(pm.completionRate)}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Projects</span>
                  <span className="font-medium text-blue-800">{pm.totalProjects}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="font-medium text-green-600">{pm.activeProjects}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-medium">{pm.completionRate}%</span>
                  </div>
                  <Progress value={pm.completionRate} className="h-2" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-red-50 hover:border-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPM(pm.name);
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View Locations
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Portfolio Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">{data.reduce((sum, pm) => sum + pm.totalProjects, 0)}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.reduce((sum, pm) => sum + pm.activeProjects, 0)}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{Math.round(data.reduce((sum, pm) => sum + pm.completionRate, 0) / data.length)}%</div>
              <div className="text-sm text-gray-600">Avg. Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{data.filter(pm => pm.completionRate < 75).length}</div>
              <div className="text-sm text-gray-600">At Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectManagerOverview;
