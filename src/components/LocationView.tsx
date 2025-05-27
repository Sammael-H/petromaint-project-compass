
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Building, Globe, TrendingUp } from 'lucide-react';

interface Location {
  id: string;
  country: string;
  region: string;
  city: string;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalValue: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface LocationViewProps {
  pmId?: string;
  onSelectLocation: (locationId: string) => void;
}

const LocationView: React.FC<LocationViewProps> = ({ pmId, onSelectLocation }) => {
  // Mock location data - in production, this would be filtered by PM from Dataverse
  const locations: Location[] = [
    {
      id: 'loc1',
      country: 'Egypt',
      region: 'Cairo Governorate',
      city: 'New Cairo',
      totalProjects: 8,
      activeProjects: 5,
      completedProjects: 3,
      totalValue: 15000000,
      riskLevel: 'Low'
    },
    {
      id: 'loc2',
      country: 'Egypt',
      region: 'Alexandria Governorate',
      city: 'Alexandria',
      totalProjects: 6,
      activeProjects: 4,
      completedProjects: 2,
      totalValue: 12000000,
      riskLevel: 'Medium'
    },
    {
      id: 'loc3',
      country: 'Saudi Arabia',
      region: 'Riyadh Province',
      city: 'Riyadh',
      totalProjects: 4,
      activeProjects: 3,
      completedProjects: 1,
      totalValue: 18000000,
      riskLevel: 'High'
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <Card 
            key={location.id}
            className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-red-300"
            onClick={() => onSelectLocation(`${location.city}, ${location.country}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800">{location.city}</h3>
                    <p className="text-sm text-gray-600">{location.region}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Globe className="w-3 h-3 mr-1" />
                      {location.country}
                    </p>
                  </div>
                </div>
                <Badge className={getRiskColor(location.riskLevel)}>
                  {location.riskLevel} Risk
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-800">{location.totalProjects}</div>
                    <div className="text-xs text-gray-600">Total Projects</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{location.activeProjects}</div>
                    <div className="text-xs text-gray-600">Active</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Project Value</span>
                    <span className="font-medium text-blue-800">
                      {(location.totalValue / 1000000).toFixed(1)}M EGP
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="font-medium">
                      {getCompletionRate(location.completedProjects, location.totalProjects)}%
                    </span>
                  </div>
                  <Progress 
                    value={getCompletionRate(location.completedProjects, location.totalProjects)} 
                    className="h-2" 
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-red-50 hover:border-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(`${location.city}, ${location.country}`);
                  }}
                >
                  <Building className="w-4 h-4 mr-2" />
                  View Clients
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Location Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Location Portfolio Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{locations.length}</div>
              <div className="text-sm text-gray-600">Active Locations</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {locations.reduce((sum, loc) => sum + loc.totalProjects, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {(locations.reduce((sum, loc) => sum + loc.totalValue, 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Total Value (EGP)</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {locations.filter(loc => loc.riskLevel === 'High').length}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationView;
