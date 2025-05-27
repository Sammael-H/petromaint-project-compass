
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { CheckSquare, Calendar, User, Clock, AlertTriangle, TrendingUp, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  startDate: string;
  dueDate: string;
  completionPercentage: number;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  comments: number;
}

interface TaskViewProps {
  projectId?: string;
}

const TaskView: React.FC<TaskViewProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  // Mock task data - in production, this would be filtered by project from Dataverse
  const tasks: Task[] = [
    {
      id: 'task1',
      name: 'Site Survey and Assessment',
      description: 'Conduct comprehensive site survey including soil analysis and environmental assessment',
      status: 'Completed',
      priority: 'High',
      assignedTo: 'Mohamed Ali',
      startDate: '2024-01-15',
      dueDate: '2024-02-10',
      completionPercentage: 100,
      estimatedHours: 120,
      actualHours: 115,
      dependencies: [],
      comments: 8
    },
    {
      id: 'task2',
      name: 'Equipment Procurement',
      description: 'Source and procure specialized refinery equipment including pumps and valves',
      status: 'In Progress',
      priority: 'Critical',
      assignedTo: 'Fatma Hassan',
      startDate: '2024-02-15',
      dueDate: '2024-04-30',
      completionPercentage: 75,
      estimatedHours: 200,
      actualHours: 160,
      dependencies: ['task1'],
      comments: 12
    },
    {
      id: 'task3',
      name: 'Foundation Construction',
      description: 'Excavation and concrete pouring for equipment foundations',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Ahmed Mahmoud',
      startDate: '2024-03-01',
      dueDate: '2024-05-15',
      completionPercentage: 45,
      estimatedHours: 300,
      actualHours: 180,
      dependencies: ['task1'],
      comments: 5
    },
    {
      id: 'task4',
      name: 'Electrical Installation',
      description: 'Install electrical systems and control panels',
      status: 'Not Started',
      priority: 'Medium',
      assignedTo: 'Sarah Ahmed',
      startDate: '2024-05-01',
      dueDate: '2024-06-30',
      completionPercentage: 0,
      estimatedHours: 180,
      actualHours: 0,
      dependencies: ['task2', 'task3'],
      comments: 2
    },
    {
      id: 'task5',
      name: 'Safety System Testing',
      description: 'Comprehensive testing of all safety systems and emergency protocols',
      status: 'Blocked',
      priority: 'Critical',
      assignedTo: 'Omar Said',
      startDate: '2024-06-15',
      dueDate: '2024-07-15',
      completionPercentage: 0,
      estimatedHours: 80,
      actualHours: 0,
      dependencies: ['task4'],
      comments: 3
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'Completed' && new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleTaskUpdate = (taskId: string, newStatus: string) => {
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}. Triggering Power Automate workflow...`,
    });
    
    // Here you would call the Power Automate flow
    console.log(`Updating task ${taskId} to ${newStatus}`);
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      blocked: tasks.filter(t => t.status === 'Blocked').length,
      overdue: tasks.filter(t => isOverdue(t.dueDate, t.status)).length
    };
  };

  const stats = getTaskStats();

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-sm text-gray-600">Blocked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <CheckSquare className="w-5 h-5 mr-2" />
            Task Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks or assignees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="border border-gray-200 hover:border-red-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-800 mb-1">{task.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                            {isOverdue(task.dueDate, task.status) && (
                              <Badge className="bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              {task.assignedTo}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              Due: {formatDate(task.dueDate)}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {task.actualHours}h / {task.estimatedHours}h
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress and Actions */}
                    <div className="lg:w-80 space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="font-medium">{task.completionPercentage}%</span>
                        </div>
                        <Progress value={task.completionPercentage} className="h-2" />
                      </div>

                      <div className="flex space-x-2">
                        {task.status !== 'Completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskUpdate(task.id, 'In Progress')}
                            className="hover:bg-blue-50"
                          >
                            Start
                          </Button>
                        )}
                        {task.status === 'In Progress' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleTaskUpdate(task.id, 'Completed')}
                          >
                            Complete
                          </Button>
                        )}
                        {task.status === 'Blocked' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskUpdate(task.id, 'In Progress')}
                            className="hover:bg-green-50"
                          >
                            Unblock
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskView;
