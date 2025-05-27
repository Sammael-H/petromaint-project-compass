
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Building, FolderOpen, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  industry: string;
  totalProjects: number;
  activeProjects: number;
  totalContractValue: number;
  averageProjectDuration: number;
  clientSince: string;
  satisfaction: number;
  paymentStatus: 'Excellent' | 'Good' | 'Delayed';
}

interface ClientViewProps {
  locationId?: string;
  onSelectClient: (clientName: string) => void;
}

const ClientView: React.FC<ClientViewProps> = ({ locationId, onSelectClient }) => {
  // Mock client data - in production, this would be filtered by location from Dataverse
  const clients: Client[] = [
    {
      id: 'client1',
      name: 'Egyptian Petroleum Corporation',
      industry: 'Oil & Gas',
      totalProjects: 5,
      activeProjects: 3,
      totalContractValue: 25000000,
      averageProjectDuration: 18,
      clientSince: '2019',
      satisfaction: 92,
      paymentStatus: 'Excellent'
    },
    {
      id: 'client2',
      name: 'Suez Canal Authority',
      industry: 'Maritime Infrastructure',
      totalProjects: 3,
      activeProjects: 2,
      totalContractValue: 15000000,
      averageProjectDuration: 24,
      clientSince: '2020',
      satisfaction: 88,
      paymentStatus: 'Good'
    },
    {
      id: 'client3',
      name: 'Cairo Metro Company',
      industry: 'Transportation',
      totalProjects: 4,
      activeProjects: 2,
      totalContractValue: 18000000,
      averageProjectDuration: 15,
      clientSince: '2021',
      satisfaction: 85,
      paymentStatus: 'Delayed'
    }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSatisfactionColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <Card 
            key={client.id}
            className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-red-300"
            onClick={() => onSelectClient(client.name)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 text-sm leading-tight">{client.name}</h3>
                    <p className="text-xs text-gray-600">{client.industry}</p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Client since {client.clientSince}
                    </p>
                  </div>
                </div>
                <Badge className={getPaymentStatusColor(client.paymentStatus)}>
                  {client.paymentStatus}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-800">{client.totalProjects}</div>
                    <div className="text-xs text-gray-600">Total Projects</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">{client.activeProjects}</div>
                    <div className="text-xs text-gray-600">Active</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Contract Value</span>
                    <span className="font-medium text-blue-800 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {(client.totalContractValue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Duration</span>
                    <span className="font-medium">{client.averageProjectDuration} months</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Satisfaction</span>
                    <span className={`font-medium ${getSatisfactionColor(client.satisfaction)}`}>
                      {client.satisfaction}%
                    </span>
                  </div>
                  <Progress value={client.satisfaction} className="h-2" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full hover:bg-red-50 hover:border-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClient(client.name);
                  }}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  View Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Portfolio Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Client Portfolio Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-800">{clients.length}</div>
              <div className="text-sm text-gray-600">Active Clients</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {clients.reduce((sum, client) => sum + client.totalProjects, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {(clients.reduce((sum, client) => sum + client.totalContractValue, 0) / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">Total Value (EGP)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(clients.reduce((sum, client) => sum + client.satisfaction, 0) / clients.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg. Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientView;
