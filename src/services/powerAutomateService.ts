import React from 'react';

// Power Automate Integration Service
// Handles triggering and monitoring Power Automate flows

export interface FlowTriggerRequest {
  flowId: string;
  data: Record<string, any>;
  headers?: Record<string, string>;
}

export interface FlowTriggerResponse {
  success: boolean;
  runId?: string;
  error?: string;
  statusUrl?: string;
}

export interface FlowRunStatus {
  runId: string;
  status: 'Running' | 'Succeeded' | 'Failed' | 'Cancelled';
  startTime: string;
  endTime?: string;
  error?: string;
  outputs?: Record<string, any>;
}

class PowerAutomateService {
  private baseUrl = 'https://prod-XX.XX.logic.azure.com/workflows'; // Replace with your region
  private defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Task Management Flows
  async updateTaskStatus(taskId: string, newStatus: string, userId: string): Promise<FlowTriggerResponse> {
    const flowData = {
      taskId,
      newStatus,
      userId,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('TASK_UPDATE_FLOW_ID', flowData);
  }

  async createTask(projectId: string, taskData: any, userId: string): Promise<FlowTriggerResponse> {
    const flowData = {
      projectId,
      task: taskData,
      createdBy: userId,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('TASK_CREATE_FLOW_ID', flowData);
  }

  async completeTask(taskId: string, completionData: any, userId: string): Promise<FlowTriggerResponse> {
    const flowData = {
      taskId,
      completionData,
      completedBy: userId,
      completionDate: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('TASK_COMPLETE_FLOW_ID', flowData);
  }

  // Project Management Flows
  async updateProjectProgress(projectId: string, progressData: any): Promise<FlowTriggerResponse> {
    const flowData = {
      projectId,
      actualProgress: progressData.actualProgress,
      plannedProgress: progressData.plannedProgress,
      variance: progressData.actualProgress - progressData.plannedProgress,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('PROJECT_PROGRESS_FLOW_ID', flowData);
  }

  async riskAssessmentUpdate(projectId: string, riskData: any): Promise<FlowTriggerResponse> {
    const flowData = {
      projectId,
      riskLevel: riskData.riskLevel,
      riskFactors: riskData.factors,
      mitigation: riskData.mitigation,
      assessedBy: riskData.assessedBy,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('RISK_ASSESSMENT_FLOW_ID', flowData);
  }

  // File Upload Flows
  async uploadProjectDocument(projectId: string, fileData: any): Promise<FlowTriggerResponse> {
    const flowData = {
      projectId,
      fileName: fileData.name,
      fileSize: fileData.size,
      fileType: fileData.type,
      uploadedBy: fileData.uploadedBy,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('DOCUMENT_UPLOAD_FLOW_ID', flowData);
  }

  // Notification Flows
  async sendTaskNotification(taskId: string, notificationData: any): Promise<FlowTriggerResponse> {
    const flowData = {
      taskId,
      notificationType: notificationData.type,
      recipients: notificationData.recipients,
      message: notificationData.message,
      priority: notificationData.priority,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('TASK_NOTIFICATION_FLOW_ID', flowData);
  }

  async sendProjectAlert(projectId: string, alertData: any): Promise<FlowTriggerResponse> {
    const flowData = {
      projectId,
      alertType: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      stakeholders: alertData.stakeholders,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('PROJECT_ALERT_FLOW_ID', flowData);
  }

  // Approval Flows
  async requestTaskApproval(taskId: string, approvalData: any): Promise<FlowTriggerResponse> {
    const flowData = {
      taskId,
      approverEmail: approvalData.approverEmail,
      approverName: approvalData.approverName,
      requestedBy: approvalData.requestedBy,
      reason: approvalData.reason,
      dueDate: approvalData.dueDate,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('TASK_APPROVAL_FLOW_ID', flowData);
  }

  // Time Tracking Flows
  async logWorkHours(taskId: string, timeData: any): Promise<FlowTriggerResponse> {
    const flowData = {
      taskId,
      userId: timeData.userId,
      hoursWorked: timeData.hours,
      workDate: timeData.date,
      description: timeData.description,
      timestamp: new Date().toISOString(),
      source: 'PetromaintMobile'
    };

    return this.triggerFlow('TIME_TRACKING_FLOW_ID', flowData);
  }

  // Generic flow trigger
  private async triggerFlow(flowId: string, data: Record<string, any>): Promise<FlowTriggerResponse> {
    try {
      // Replace with actual flow webhook URLs
      const flowUrls: Record<string, string> = {
        'TASK_UPDATE_FLOW_ID': 'YOUR_TASK_UPDATE_WEBHOOK_URL',
        'TASK_CREATE_FLOW_ID': 'YOUR_TASK_CREATE_WEBHOOK_URL',
        'TASK_COMPLETE_FLOW_ID': 'YOUR_TASK_COMPLETE_WEBHOOK_URL',
        'PROJECT_PROGRESS_FLOW_ID': 'YOUR_PROJECT_PROGRESS_WEBHOOK_URL',
        'RISK_ASSESSMENT_FLOW_ID': 'YOUR_RISK_ASSESSMENT_WEBHOOK_URL',
        'DOCUMENT_UPLOAD_FLOW_ID': 'YOUR_DOCUMENT_UPLOAD_WEBHOOK_URL',
        'TASK_NOTIFICATION_FLOW_ID': 'YOUR_TASK_NOTIFICATION_WEBHOOK_URL',
        'PROJECT_ALERT_FLOW_ID': 'YOUR_PROJECT_ALERT_WEBHOOK_URL',
        'TASK_APPROVAL_FLOW_ID': 'YOUR_TASK_APPROVAL_WEBHOOK_URL',
        'TIME_TRACKING_FLOW_ID': 'YOUR_TIME_TRACKING_WEBHOOK_URL'
      };

      const webhookUrl = flowUrls[flowId];
      if (!webhookUrl) {
        throw new Error(`Flow webhook URL not configured for ${flowId}`);
      }

      console.log(`Triggering Power Automate flow: ${flowId}`, data);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify(data),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json().catch(() => ({}));

      return {
        success: true,
        runId: responseData.runId || `run-${Date.now()}`,
        statusUrl: responseData.statusUrl
      };

    } catch (error) {
      console.error(`Failed to trigger flow ${flowId}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Monitor flow execution
  async getFlowRunStatus(runId: string): Promise<FlowRunStatus | null> {
    try {
      // In a real implementation, this would call the Power Automate management API
      // For now, we'll return a mock status
      return {
        runId,
        status: 'Succeeded',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        outputs: { message: 'Flow completed successfully' }
      };
    } catch (error) {
      console.error('Failed to get flow run status:', error);
      return null;
    }
  }

  // Batch operations
  async triggerMultipleFlows(requests: FlowTriggerRequest[]): Promise<FlowTriggerResponse[]> {
    const results = await Promise.allSettled(
      requests.map(req => this.triggerFlow(req.flowId, req.data))
    );

    return results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { success: false, error: 'Request failed' }
    );
  }

  // Error handling and retry logic
  async triggerFlowWithRetry(
    flowId: string, 
    data: Record<string, any>, 
    maxRetries: number = 3
  ): Promise<FlowTriggerResponse> {
    let lastError: string = '';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.triggerFlow(flowId, data);
        if (result.success) {
          return result;
        }
        lastError = result.error || 'Unknown error';
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
      }

      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return {
      success: false,
      error: `Failed after ${maxRetries} attempts: ${lastError}`
    };
  }
}

// Service instance
export const powerAutomateService = new PowerAutomateService();

// React hook for Power Automate integration
export const usePowerAutomate = () => {
  const [loading, setLoading] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<FlowTriggerResponse | null>(null);

  const triggerFlow = async (flowId: string, data: Record<string, any>): Promise<FlowTriggerResponse> => {
    setLoading(true);
    try {
      const result = await powerAutomateService.triggerFlowWithRetry(flowId, data);
      setLastResult(result);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    lastResult,
    triggerFlow,
    updateTaskStatus: powerAutomateService.updateTaskStatus.bind(powerAutomateService),
    createTask: powerAutomateService.createTask.bind(powerAutomateService),
    completeTask: powerAutomateService.completeTask.bind(powerAutomateService),
    updateProjectProgress: powerAutomateService.updateProjectProgress.bind(powerAutomateService),
    riskAssessmentUpdate: powerAutomateService.riskAssessmentUpdate.bind(powerAutomateService),
    uploadProjectDocument: powerAutomateService.uploadProjectDocument.bind(powerAutomateService),
    sendTaskNotification: powerAutomateService.sendTaskNotification.bind(powerAutomateService),
    sendProjectAlert: powerAutomateService.sendProjectAlert.bind(powerAutomateService),
    requestTaskApproval: powerAutomateService.requestTaskApproval.bind(powerAutomateService),
    logWorkHours: powerAutomateService.logWorkHours.bind(powerAutomateService)
  };
};

export default PowerAutomateService;
