
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface PMOverviewScreenProps {
  onSelectPM: (pmId: string) => void;
}

const PMOverviewScreen: React.FC<PMOverviewScreenProps> = ({ onSelectPM }) => {
  const kpiData = [
    {
      title: "Total Projects",
      value: "37",
      icon: <Building className="w-5 h-5" />,
      color: "text-brand-primary"
    },
    {
      title: "Contract Value",
      value: "150M EGP",
      icon: <DollarSign className="w-5 h-5" />,
      color: "text-status-on-time"
    },
    {
      title: "At-Risk Projects",
      value: "5",
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-brand-accent-red"
    }
  ];

  const projectManagers = [
    { id: 'pm1', name: 'Eng. Mohamed Mousa', projects: 31, activeProjects: 25, completionRate: 85 },
    { id: 'pm2', name: 'Eng. Ibrahim Abdel-Shafy', projects: 3, activeProjects: 2, completionRate: 78 },
    { id: 'pm3', name: 'Eng. Islam Karaweih', projects: 2, activeProjects: 1, completionRate: 92 },
    { id: 'pm4', name: 'Eng. Mohamed Kamal', projects: 1, activeProjects: 1, completionRate: 88 }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="border-2 border-brand-accent-red">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${kpi.color} bg-gray-100`}>
                  {kpi.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-brand-primary mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold text-brand-primary">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Power BI Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-primary flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            At-Risk Projects by PM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            [Power BI Pie Chart Placeholder]
          </div>
        </CardContent>
      </Card>

      {/* Project Managers Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-primary flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Project Managers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectManagers.map((pm) => (
              <div
                key={pm.id}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-accent-yellow transition-colors bg-white"
                onClick={() => onSelectPM(pm.id)}
                role="button"
                tabIndex={0}
                aria-label={`${pm.name}, ${pm.projects} Projects`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectPM(pm.id);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-brand-primary">{pm.name}</h4>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span>Total: {pm.projects}</span>
                      <span>Active: {pm.activeProjects}</span>
                      <span className="text-status-on-time">Completion: {pm.completionRate}%</span>
                    </div>
                  </div>
                  <div className="text-brand-accent-red font-medium">
                    View Details →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMOverviewScreen;
