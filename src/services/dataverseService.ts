
// Dataverse API Integration Service
// This service handles all interactions with Microsoft Dataverse

export interface DataverseConfig {
  baseUrl: string;
  apiVersion: string;
}

export interface AuthToken {
  accessToken: string;
  expiresAt: number;
}

export interface Project {
  projectid: string;
  name: string;
  contractvalue: number;
  actualrevenue: number;
  actualprogresspercent: number;
  plannedprogresspercent: number;
  startdate: string;
  enddate: string;
  projectstatus: string;
  risklevel: string;
  projectmanagerid: string;
  clientid: string;
  locationid: string;
}

export interface User {
  userid: string;
  fullname: string;
  emailaddress: string;
  role: string;
}

export interface Task {
  taskid: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  assignedtoid: string;
  projectid: string;
  startdate: string;
  duedate: string;
  completionpercentage: number;
  estimatedhours: number;
  actualhours: number;
}

class DataverseService {
  private config: DataverseConfig;
  private authToken: AuthToken | null = null;

  constructor(config: DataverseConfig) {
    this.config = config;
  }

  // Authentication
  async authenticate(token: string): Promise<void> {
    this.authToken = {
      accessToken: token,
      expiresAt: Date.now() + (3600 * 1000) // 1 hour
    };
  }

  private getHeaders(): HeadersInit {
    if (!this.authToken || Date.now() > this.authToken.expiresAt) {
      throw new Error('Authentication token expired');
    }

    return {
      'Authorization': `Bearer ${this.authToken.accessToken}`,
      'Content-Type': 'application/json',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      'Accept': 'application/json'
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}/api/data/${this.config.apiVersion}/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Dataverse API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Project Methods
  async getProjects(filter?: string): Promise<Project[]> {
    let endpoint = 'projects';
    if (filter) {
      endpoint += `?$filter=${encodeURIComponent(filter)}`;
    }
    
    const response = await this.makeRequest<{ value: Project[] }>(endpoint);
    return response.value;
  }

  async getProjectsByManager(managerId: string): Promise<Project[]> {
    const filter = `_projectmanagerid_value eq ${managerId}`;
    return this.getProjects(filter);
  }

  async getProjectsByLocation(locationId: string): Promise<Project[]> {
    const filter = `_locationid_value eq ${locationId}`;
    return this.getProjects(filter);
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    const filter = `_clientid_value eq ${clientId}`;
    return this.getProjects(filter);
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    await this.makeRequest(`projects(${projectId})`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Task Methods
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const filter = `_projectid_value eq ${projectId}`;
    const endpoint = `tasks?$filter=${encodeURIComponent(filter)}`;
    
    const response = await this.makeRequest<{ value: Task[] }>(endpoint);
    return response.value;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    await this.makeRequest(`tasks(${taskId})`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async createTask(task: Omit<Task, 'taskid'>): Promise<string> {
    const response = await this.makeRequest<{ taskid: string }>('tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    });
    return response.taskid;
  }

  // User Methods
  async getUsers(): Promise<User[]> {
    const response = await this.makeRequest<{ value: User[] }>('users');
    return response.value;
  }

  async getUserById(userId: string): Promise<User> {
    return this.makeRequest<User>(`users(${userId})`);
  }

  // Analytics Methods
  async getProjectKPIs(): Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalRevenue: number;
    averageCompletion: number;
  }> {
    const projects = await this.getProjects();
    
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.projectstatus === 'In Progress').length,
      completedProjects: projects.filter(p => p.projectstatus === 'Completed').length,
      totalRevenue: projects.reduce((sum, p) => sum + (p.actualrevenue || 0), 0),
      averageCompletion: projects.reduce((sum, p) => sum + (p.actualprogresspercent || 0), 0) / projects.length
    };
  }

  // Bulk Operations
  async bulkUpdateTasks(updates: Array<{ taskId: string; updates: Partial<Task> }>): Promise<void> {
    const promises = updates.map(({ taskId, updates: taskUpdates }) => 
      this.updateTask(taskId, taskUpdates)
    );
    
    await Promise.all(promises);
  }

  // Error Logging
  async logError(error: {
    source: string;
    message: string;
    details?: string;
    timestamp?: string;
  }): Promise<void> {
    const errorLog = {
      ...error,
      timestamp: error.timestamp || new Date().toISOString()
    };

    await this.makeRequest('errorlogs', {
      method: 'POST',
      body: JSON.stringify(errorLog)
    });
  }
}

// Service instance factory
export const createDataverseService = (orgUrl: string, apiVersion: string = 'v9.2'): DataverseService => {
  return new DataverseService({
    baseUrl: orgUrl,
    apiVersion
  });
};

// Default export
export default DataverseService;
