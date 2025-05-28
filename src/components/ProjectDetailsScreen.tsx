
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

interface ProjectDetailsScreenProps {
  projectId: string | null;
  onBack: () => void;
}

const ProjectDetailsScreen: React.FC<ProjectDetailsScreenProps> = ({ projectId, onBack }) => {
  const [activeTab, setActiveTab] = useState('timeline');

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'operational', label: 'Operational', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'risk', label: 'Risk', icon: <AlertTriangle className="w-4 h-4" /> }
  ];

  const financialData = [
    { quarter: 'Q1 2024', revenue: '10M EGP', budget: '8M EGP', variance: '+2M EGP' },
    { quarter: 'Q2 2024', revenue: '12M EGP', budget: '10M EGP', variance: '+2M EGP' },
    { quarter: 'Q3 2024', revenue: '8M EGP', budget: '9M EGP', variance: '-1M EGP' },
    { quarter: 'Q4 2024', revenue: '15M EGP', budget: '13M EGP', variance: '+2M EGP' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timeline':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              [Power BI Timeline Chart Placeholder]
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-brand-primary mb-2">Project Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Completion</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-brand-primary mb-2">Key Dates</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Start Date:</span>
                      <span>13/11/2022</span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span>31/12/2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-brand-accent-red">Overdue</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'financial':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              [Power BI Financial Chart Placeholder]
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {financialData.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-brand-primary mb-2">{item.quarter}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="text-status-on-time font-medium">{item.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget:</span>
                        <span>{item.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variance:</span>
                        <span className={item.variance.startsWith('+') ? 'text-status-on-time' : 'text-brand-accent-red'}>
                          {item.variance}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'operational':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              [Power BI Operational Metrics Placeholder]
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-brand-primary mb-2">Team Size</h4>
                  <p className="text-2xl font-bold text-brand-primary">25</p>
                  <p className="text-sm text-gray-600">Active Members</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-brand-primary mb-2">Utilization</h4>
                  <p className="text-2xl font-bold text-status-on-time">87%</p>
                  <p className="text-sm text-gray-600">Resource Usage</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-brand-primary mb-2">Quality Score</h4>
                  <p className="text-2xl font-bold text-brand-accent-yellow">92</p>
                  <p className="text-sm text-gray-600">Out of 100</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'risk':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              [Power BI Risk Assessment Placeholder]
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-primary">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-brand-accent-red bg-red-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-brand-accent-red mr-2" />
                      <span className="font-semibold text-brand-accent-red">High Risk</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Project is both behind schedule and nearing its end date. Increase resources, 
                      expedite critical tasks, negotiate deadline extension, perform risk reassessment.
                    </p>
                  </div>
                  <div className="p-3 border border-brand-accent-yellow bg-yellow-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-brand-accent-yellow mr-2" />
                      <span className="font-semibold text-brand-accent-yellow">Medium Risk</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Budget utilization at 66.5%. Monitor closely and allocate additional resources if needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            aria-label="Back to Projects"
            className="text-brand-primary hover:text-brand-accent-red"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-brand-primary">Project Alpha Details</h2>
            <p className="text-sm text-gray-600">ID: {projectId}</p>
          </div>
        </div>
        <span className="text-sm text-gray-600">PM: Sarah Lee</span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-0" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-accent-red text-brand-accent-red'
                  : 'border-transparent text-brand-primary hover:text-brand-accent-red'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProjectDetailsScreen;
