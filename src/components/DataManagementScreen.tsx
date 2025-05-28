
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, FileText, CheckCircle } from 'lucide-react';

interface DataManagementScreenProps {
  onBack: () => void;
}

const DataManagementScreen: React.FC<DataManagementScreenProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    awardDate: '',
    status: ''
  });
  const [uploadStatus, setUploadStatus] = useState('No file uploaded');
  const [uploadStatusColor, setUploadStatusColor] = useState('text-brand-accent-yellow');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    alert('Project details submitted successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus(`File uploaded: ${file.name}`);
      setUploadStatusColor('text-status-on-time');
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
            aria-label="Back to Previous Screen"
            className="text-brand-primary hover:text-brand-accent-red"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-brand-primary">Data Management</h2>
        </div>
        <span className="text-sm text-gray-600">Admin: Alex Brown</span>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-primary flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Project Entry Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-brand-primary font-semibold">
                  Project Name *
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Enter Project Name"
                  required
                  className="border-gray-300 focus:border-brand-accent-red"
                  aria-label="Enter Project Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client" className="text-brand-primary font-semibold">
                  Client *
                </Label>
                <select
                  id="client"
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-brand-accent-red focus:outline-none"
                  aria-label="Select Client"
                >
                  <option value="">Select Client</option>
                  <option value="BURULLUS GAS CO.">BURULLUS GAS CO.</option>
                  <option value="Egyptian Propylene & Polypropylene Co.">Egyptian Propylene & Polypropylene Co.</option>
                  <option value="Abu Qir Petroleum Co">Abu Qir Petroleum Co</option>
                  <option value="Misr Petroleum Co.">Misr Petroleum Co.</option>
                  <option value="PPC">PPC</option>
                  <option value="Petrosilah">Petrosilah</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="awardDate" className="text-brand-primary font-semibold">
                  Award Date
                </Label>
                <Input
                  id="awardDate"
                  type="date"
                  value={formData.awardDate}
                  onChange={(e) => handleInputChange('awardDate', e.target.value)}
                  className="border-gray-300 focus:border-brand-accent-red"
                  aria-label="Select Award Date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-brand-primary font-semibold">
                  Status *
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-brand-accent-red focus:outline-none"
                  aria-label="Select Status"
                >
                  <option value="">Select Status</option>
                  <option value="Not started">Not started</option>
                  <option value="In progress">In progress</option>
                  <option value="Complete">Complete</option>
                  <option value="On hold">On hold</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-brand-accent-red hover:bg-red-700 text-white"
              aria-label="Submit Project Details"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Project Details
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-brand-primary flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <Label htmlFor="fileUpload" className="cursor-pointer">
                  <span className="text-brand-primary font-medium hover:text-brand-accent-red">
                    Click to upload CSV file
                  </span>
                  <Input
                    id="fileUpload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload CSV File"
                  />
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              <p className={`text-sm font-medium ${uploadStatusColor}`}>
                {uploadStatus}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagementScreen;
