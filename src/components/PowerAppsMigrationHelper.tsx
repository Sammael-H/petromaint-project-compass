import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Copy, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { powerAppsExportData, copilotPrompts, powerAppsFormulas } from '../utils/powerAppsExport';
import { useToast } from '@/hooks/use-toast';

interface MigrationStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: 'pending' | 'in-progress' | 'completed';
  action?: () => void;
}

const PowerAppsMigrationHelper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);
  const { toast } = useToast();

  const migrationSteps: MigrationStep[] = [
    {
      id: 1,
      title: "Export Project Data",
      description: "Download Excel file with your 37 projects formatted for Power Apps",
      duration: "5 min",
      status: currentStep === 1 ? 'in-progress' : currentStep > 1 ? 'completed' : 'pending',
      action: () => downloadExcelData()
    },
    {
      id: 2,
      title: "Upload to SharePoint/OneDrive",
      description: "Save the Excel file to SharePoint Online or OneDrive for Business",
      duration: "5 min",
      status: currentStep === 2 ? 'in-progress' : currentStep > 2 ? 'completed' : 'pending'
    },
    {
      id: 3,
      title: "Create Power Apps Environment",
      description: "Set up your Power Platform environment and connect to data",
      duration: "10 min",
      status: currentStep === 3 ? 'in-progress' : currentStep > 3 ? 'completed' : 'pending'
    },
    {
      id: 4,
      title: "Use Copilot Prompts",
      description: "Copy and paste the AI prompts to build your app automatically",
      duration: "60 min",
      status: currentStep === 4 ? 'in-progress' : currentStep > 4 ? 'completed' : 'pending'
    },
    {
      id: 5,
      title: "Apply Branding & Polish",
      description: "Add Petromaint colors, logos, and final customizations",
      duration: "30 min",
      status: currentStep === 5 ? 'in-progress' : currentStep > 5 ? 'completed' : 'pending'
    },
    {
      id: 6,
      title: "Deploy & Share",
      description: "Publish your app and share with team members",
      duration: "15 min",
      status: currentStep === 6 ? 'in-progress' : currentStep > 6 ? 'completed' : 'pending'
    }
  ];

  const downloadExcelData = () => {
    // Convert data to CSV format for download
    const headers = Object.values(powerAppsExportData[0] || {}).map((_, index) => 
      Object.keys(powerAppsExportData[0])[index]
    );
    
    const csvContent = [
      headers.join(','),
      ...powerAppsExportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Petromaint_Projects_PowerApps.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCurrentStep(2);
    toast({
      title: "Export Complete",
      description: "Project data downloaded successfully. Upload to SharePoint next.",
    });
  };

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== undefined) {
        setCopiedPrompt(index);
        setTimeout(() => setCopiedPrompt(null), 2000);
      }
      toast({
        title: "Copied to Clipboard",
        description: "Content copied successfully",
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <div className="w-5 h-5 rounded-full bg-blue-600 animate-pulse" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card className="border-brand-accent-red">
        <CardHeader>
          <CardTitle className="flex items-center text-brand-primary">
            <ExternalLink className="w-6 h-6 mr-3" />
            Power Apps Migration Assistant
          </CardTitle>
          <p className="text-gray-600">
            Convert your Petromaint React app to Power Apps with AI Copilot - No coding required!
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-4">
            <div>
              <h3 className="font-semibold text-brand-primary">Ready to Migrate</h3>
              <p className="text-sm text-gray-600">37 projects • 6 project managers • 3 regions</p>
            </div>
            <Button 
              onClick={() => setCurrentStep(1)} 
              className="bg-brand-accent-red hover:bg-red-700"
            >
              Start Migration <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Migration Steps */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Migration Steps</CardTitle>
              <p className="text-sm text-gray-600">Follow these steps to migrate your app to Power Apps</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {migrationSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 mt-1">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-brand-primary">{step.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      {step.action && step.status === 'in-progress' && (
                        <Button 
                          size="sm" 
                          onClick={step.action}
                          className="mt-2 bg-brand-accent-red hover:bg-red-700"
                        >
                          {step.id === 1 ? <Download className="w-4 h-4 mr-2" /> : null}
                          {step.id === 1 ? 'Download Excel' : 'Complete Step'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('https://make.powerapps.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Power Apps Studio
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('https://admin.powerplatform.microsoft.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Power Platform Admin
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('https://app.powerbi.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Power BI Service
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Migration Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Zero coding required</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Mobile responsive automatically</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Built-in security & sharing</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Office 365 integration</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Copilot Prompts & Formulas */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prompts">
            <TabsList>
              <TabsTrigger value="prompts">Copilot Prompts</TabsTrigger>
              <TabsTrigger value="formulas">Power Apps Formulas</TabsTrigger>
              <TabsTrigger value="data">Data Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="prompts" className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Copy these prompts into Power Apps Copilot to build your app automatically
              </p>
              {copilotPrompts.map((prompt, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">Prompt {index + 1}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(prompt, index)}
                    >
                      {copiedPrompt === index ? (
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {copiedPrompt === index ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <p className="text-sm bg-gray-50 p-3 rounded border">{prompt}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="formulas" className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Power Apps formulas for common calculations and data operations
              </p>
              {Object.entries(powerAppsFormulas).map(([name, formula]) => (
                <div key={name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{name}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formula)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <code className="text-xs bg-gray-50 p-3 rounded border block overflow-x-auto">
                    {formula}
                  </code>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Preview of your project data formatted for Power Apps
              </p>
              <div className="overflow-x-auto">
                <div className="bg-gray-50 p-4 rounded border">
                  <p className="text-sm font-medium mb-2">
                    {powerAppsExportData.length} projects ready for export
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <strong>Project Managers:</strong> 
                      {[...new Set(powerAppsExportData.map(p => p['Project Manager']))].length}
                    </div>
                    <div>
                      <strong>Regions:</strong> 
                      {[...new Set(powerAppsExportData.map(p => p['Region']))].length}
                    </div>
                    <div>
                      <strong>Companies:</strong> 
                      {[...new Set(powerAppsExportData.map(p => p['Company Name']))].length}
                    </div>
                    <div>
                      <strong>Data Columns:</strong> 
                      {Object.keys(powerAppsExportData[0] || {}).length}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerAppsMigrationHelper;