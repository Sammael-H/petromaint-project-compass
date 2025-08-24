
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Users, MapPin, Building, FolderOpen, CheckSquare, TrendingUp, AlertTriangle, Settings, Database } from 'lucide-react';
import PMOverviewScreen from '@/components/PMOverviewScreen';
import ProjectDetailsScreen from '@/components/ProjectDetailsScreen';
import DataManagementScreen from '@/components/DataManagementScreen';
import LocationView from '@/components/LocationView';
import ClientView from '@/components/ClientView';
import ProjectView from '@/components/ProjectView';
import TaskView from '@/components/TaskView';
import DashboardCard from '@/components/DashboardCard';
import { useToast } from '@/hooks/use-toast';

interface NavigationState {
  level: 'pm' | 'location' | 'client' | 'project' | 'task' | 'details' | 'data';
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

  // Mock data
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
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Navigation Updated",
        description: `Navigated to ${newNav.level} level`,
      });
    }, 500);
  };

  const getBreadcrumb = () => {
    const items = [
      { label: 'Portfolio', active: navigation.level === 'pm', onClick: () => handleNavigation({ level: 'pm', selectedPM: undefined, selectedLocation: undefined, selectedClient: undefined, selectedProject: undefined }) }
    ];
    
    if (navigation.selectedPM) {
      items.push({ label: navigation.selectedPM, active: navigation.level === 'location', onClick: () => handleNavigation({ level: 'location' }) });
    }
    if (navigation.selectedLocation) {
      items.push({ label: navigation.selectedLocation, active: navigation.level === 'client', onClick: () => handleNavigation({ level: 'client' }) });
    }
    if (navigation.selectedClient) {
      items.push({ label: navigation.selectedClient, active: navigation.level === 'project', onClick: () => handleNavigation({ level: 'project' }) });
    }
    if (navigation.selectedProject) {
      items.push({ label: navigation.selectedProject, active: navigation.level === 'task', onClick: () => handleNavigation({ level: 'task' }) });
    }
    
    return items;
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent-red mx-auto mb-4"></div>
            <p className="text-brand-primary">Loading data from Dataverse...</p>
          </div>
        </div>
      );
    }

    switch (navigation.level) {
      case 'pm':
        return <PMOverviewScreen onSelectPM={(pm) => handleNavigation({ level: 'location', selectedPM: pm })} />;
      case 'location':
        return <LocationView pmId={navigation.selectedPM} onSelectLocation={(loc) => handleNavigation({ level: 'client', selectedLocation: loc })} />;
      case 'client':
        return <ClientView locationId={navigation.selectedLocation} onSelectClient={(client) => handleNavigation({ level: 'project', selectedClient: client })} />;
      case 'project':
        return <ProjectView clientId={navigation.selectedClient} onSelectProject={(project) => handleNavigation({ level: 'details', selectedProject: project })} />;
      case 'task':
        return <TaskView projectId={navigation.selectedProject} />;
      case 'details':
        return <ProjectDetailsScreen projectId={navigation.selectedProject} onBack={() => handleNavigation({ level: 'project' })} />;
      case 'data':
        return <DataManagementScreen onBack={() => handleNavigation({ level: 'pm' })} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-brand-accent-red rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-primary">Petromaint</h1>
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
                  className="pl-10 border-gray-300 focus:border-brand-accent-red"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigation({ level: 'data' })}
                className="text-brand-primary border-brand-primary hover:bg-brand-accent-red hover:text-white"
              >
                <Database className="w-4 h-4 mr-2" />
                Data Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('/migrate', '_blank')}
                className="text-brand-primary border-brand-primary hover:bg-brand-accent-yellow hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Migrate to Power Apps
              </Button>
              <Badge variant="outline" className="text-brand-primary border-brand-primary">
                <Users className="w-3 h-3 mr-1" />
                Project Manager
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {navigation.level !== 'data' && (
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-3">
              {getBreadcrumb().map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    onClick={item.onClick}
                    className={item.active ? "bg-brand-accent-red text-white hover:bg-red-700" : "text-gray-600 hover:text-brand-primary"}
                  >
                    {item.label}
                  </Button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </nav>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Primary Content */}
          <div className="lg:col-span-3">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-brand-primary">
                  {navigation.level === 'pm' && <Users className="w-5 h-5 mr-2" />}
                  {navigation.level === 'location' && <MapPin className="w-5 h-5 mr-2" />}
                  {navigation.level === 'client' && <Building className="w-5 h-5 mr-2" />}
                  {navigation.level === 'project' && <FolderOpen className="w-5 h-5 mr-2" />}
                  {navigation.level === 'task' && <CheckSquare className="w-5 h-5 mr-2" />}
                  {navigation.level === 'details' && <TrendingUp className="w-5 h-5 mr-2" />}
                  {navigation.level === 'data' && <Database className="w-5 h-5 mr-2" />}
                  {navigation.level === 'pm' && 'Project Managers'}
                  {navigation.level === 'location' && 'Locations'}
                  {navigation.level === 'client' && 'Clients'}
                  {navigation.level === 'project' && 'Projects'}
                  {navigation.level === 'task' && 'Tasks'}
                  {navigation.level === 'details' && 'Project Details'}
                  {navigation.level === 'data' && 'Data Management'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCurrentView()}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Analytics & Quick Actions */}
          {navigation.level !== 'data' && (
            <div className="space-y-6">
              {/* Power BI Embedded Placeholder */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-brand-primary">Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-lg p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-brand-accent-red mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">Power BI Dashboard</p>
                    <Button size="sm" className="bg-brand-accent-red hover:bg-red-700 text-white">
                      View Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-brand-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left border-gray-300 hover:border-brand-accent-yellow" size="sm">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Create New Project
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left border-gray-300 hover:border-brand-accent-yellow" size="sm">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left border-gray-300 hover:border-brand-accent-yellow" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left border-gray-300 hover:border-brand-accent-yellow" size="sm">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Risk Assessment
                  </Button>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-brand-primary">Portfolio Progress</CardTitle>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PetromaintApp;
