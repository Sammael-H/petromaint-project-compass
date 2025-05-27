
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Search, Users, MapPin, Building, FolderOpen, CheckSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import ProjectManagerOverview from '@/components/ProjectManagerOverview';
import LocationView from '@/components/LocationView';
import ClientView from '@/components/ClientView';
import ProjectView from '@/components/ProjectView';
import TaskView from '@/components/TaskView';
import DashboardCard from '@/components/DashboardCard';
import { useToast } from '@/hooks/use-toast';

interface NavigationState {
  level: 'pm' | 'location' | 'client' | 'project' | 'task';
  selectedPM?: string;
  selectedLocation?: string;
  selectedClient?: string;
  selectedProject?: string;
}

const PetromaintApp = () => {
  const [navigation, setNavigation] = useState<NavigationState>({ level: 'pm' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data - in production this would come from Dataverse
  const mockData = {
    projectManagers: [
      { id: 'pm1', name: 'Ahmed Hassan', totalProjects: 12, activeProjects: 8, completionRate: 85 },
      { id: 'pm2', name: 'Sarah Mohamed', totalProjects: 15, activeProjects: 11, completionRate: 92 },
      { id: 'pm3', name: 'Omar Farouk', totalProjects: 9, activeProjects: 6, completionRate: 78 }
    ],
    kpis: {
      totalProjects: 37,
      activeProjects: 25,
      completedProjects: 12,
      avgCompletion: 85,
      totalRevenue: 45000000,
      riskProjects: 3
    }
  };

  const handleNavigation = (newNav: Partial<NavigationState>) => {
    setNavigation(prev => ({ ...prev, ...newNav }));
    
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Navigation Updated",
        description: `Navigated to ${newNav.level} level`,
      });
    }, 800);
  };

  const getBreadcrumb = () => {
    const items = [
      { label: 'Portfolio', active: navigation.level === 'pm' }
    ];
    
    if (navigation.selectedPM) {
      items.push({ label: navigation.selectedPM, active: navigation.level === 'location' });
    }
    if (navigation.selectedLocation) {
      items.push({ label: navigation.selectedLocation, active: navigation.level === 'client' });
    }
    if (navigation.selectedClient) {
      items.push({ label: navigation.selectedClient, active: navigation.level === 'project' });
    }
    if (navigation.selectedProject) {
      items.push({ label: navigation.selectedProject, active: navigation.level === 'task' });
    }
    
    return items;
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-blue-800">Loading data from Dataverse...</p>
          </div>
        </div>
      );
    }

    switch (navigation.level) {
      case 'pm':
        return <ProjectManagerOverview data={mockData.projectManagers} onSelectPM={(pm) => handleNavigation({ level: 'location', selectedPM: pm })} />;
      case 'location':
        return <LocationView pmId={navigation.selectedPM} onSelectLocation={(loc) => handleNavigation({ level: 'client', selectedLocation: loc })} />;
      case 'client':
        return <ClientView locationId={navigation.selectedLocation} onSelectClient={(client) => handleNavigation({ level: 'project', selectedClient: client })} />;
      case 'project':
        return <ProjectView clientId={navigation.selectedClient} onSelectProject={(project) => handleNavigation({ level: 'task', selectedProject: project })} />;
      case 'task':
        return <TaskView projectId={navigation.selectedProject} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-800">Petromaint</h1>
                <p className="text-sm text-gray-600">Project Management Platform</p>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search projects, tasks, or clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                Project Manager
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-3">
            {getBreadcrumb().map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <Button
                  variant={item.active ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    if (index === 0) handleNavigation({ level: 'pm', selectedPM: undefined, selectedLocation: undefined, selectedClient: undefined, selectedProject: undefined });
                  }}
                  className={item.active ? "bg-red-600 text-white" : "text-gray-600 hover:text-blue-800"}
                >
                  {item.label}
                </Button>
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Dashboard - Only show on PM level */}
        {navigation.level === 'pm' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <DashboardCard
              title="Total Projects"
              value={mockData.kpis.totalProjects.toString()}
              icon={<FolderOpen className="w-5 h-5" />}
              trend="+12%"
              trendUp={true}
            />
            <DashboardCard
              title="Active Projects"
              value={mockData.kpis.activeProjects.toString()}
              icon={<CheckSquare className="w-5 h-5" />}
              trend="+5%"
              trendUp={true}
            />
            <DashboardCard
              title="Completed"
              value={mockData.kpis.completedProjects.toString()}
              icon={<TrendingUp className="w-5 h-5" />}
              trend="+8%"
              trendUp={true}
            />
            <DashboardCard
              title="Avg. Completion"
              value={`${mockData.kpis.avgCompletion}%`}
              icon={<TrendingUp className="w-5 h-5" />}
              trend="+3%"
              trendUp={true}
            />
            <DashboardCard
              title="Total Revenue"
              value={`${(mockData.kpis.totalRevenue / 1000000).toFixed(1)}M EGP`}
              icon={<TrendingUp className="w-5 h-5" />}
              trend="+15%"
              trendUp={true}
            />
            <DashboardCard
              title="Risk Projects"
              value={mockData.kpis.riskProjects.toString()}
              icon={<AlertTriangle className="w-5 h-5" />}
              trend="-2"
              trendUp={false}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Primary Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  {navigation.level === 'pm' && <Users className="w-5 h-5 mr-2" />}
                  {navigation.level === 'location' && <MapPin className="w-5 h-5 mr-2" />}
                  {navigation.level === 'client' && <Building className="w-5 h-5 mr-2" />}
                  {navigation.level === 'project' && <FolderOpen className="w-5 h-5 mr-2" />}
                  {navigation.level === 'task' && <CheckSquare className="w-5 h-5 mr-2" />}
                  {navigation.level === 'pm' && 'Project Managers'}
                  {navigation.level === 'location' && 'Locations'}
                  {navigation.level === 'client' && 'Clients'}
                  {navigation.level === 'project' && 'Projects'}
                  {navigation.level === 'task' && 'Tasks'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCurrentView()}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Analytics & Quick Actions */}
          <div className="space-y-6">
            {/* Power BI Embedded Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-800">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-lg p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">Power BI Dashboard</p>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start text-left" size="sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-blue-800">Portfolio Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Completion</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On Schedule</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Budget Utilization</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetromaintApp;
