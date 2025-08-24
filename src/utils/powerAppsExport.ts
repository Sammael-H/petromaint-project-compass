// Power Apps Export Utilities
// Helper functions to prepare data for Power Apps migration

import { ProjectExportData, mockProjectData, powerAppsColumnMapping } from '../data/projectData';

export interface PowerAppsExportOptions {
  includeHeaders: boolean;
  formatForExcel: boolean;
  includeFormulas: boolean;
}

export class PowerAppsExportService {
  
  /**
   * Convert React project data to Power Apps compatible format
   */
  static formatForPowerApps(data: ProjectExportData[], options: PowerAppsExportOptions = {
    includeHeaders: true,
    formatForExcel: true,
    includeFormulas: false
  }): any[] {
    
    const formattedData = data.map(project => ({
      // Basic Project Info
      [powerAppsColumnMapping.projectManager]: project.projectManager,
      [powerAppsColumnMapping.projectCode]: project.projectCode,
      [powerAppsColumnMapping.projectName]: project.projectName,
      [powerAppsColumnMapping.projectType]: project.projectType,
      [powerAppsColumnMapping.projectSize]: project.projectSize,
      
      // Location Data
      [powerAppsColumnMapping.country]: project.country,
      [powerAppsColumnMapping.region]: project.region,
      [powerAppsColumnMapping.city]: project.city,
      [powerAppsColumnMapping.technicalManager]: project.technicalManager,
      
      // Company Info
      [powerAppsColumnMapping.companyCode]: project.companyCode,
      [powerAppsColumnMapping.companyName]: project.companyName,
      [powerAppsColumnMapping.sector]: project.sector,
      [powerAppsColumnMapping.businessType]: project.businessType,
      [powerAppsColumnMapping.facilityType]: project.facilityType,
      [powerAppsColumnMapping.projectClass]: project.projectClass,
      [powerAppsColumnMapping.location]: project.location,
      
      // Timeline
      [powerAppsColumnMapping.duration]: project.duration,
      [powerAppsColumnMapping.currentDate]: this.formatDate(project.currentDate, options.formatForExcel),
      [powerAppsColumnMapping.actualStartDate]: this.formatDate(project.actualStartDate, options.formatForExcel),
      [powerAppsColumnMapping.plannedStartDate]: this.formatDate(project.plannedStartDate, options.formatForExcel),
      [powerAppsColumnMapping.actualEndDate]: this.formatDate(project.actualEndDate, options.formatForExcel),
      [powerAppsColumnMapping.plannedEndDate]: this.formatDate(project.plannedEndDate, options.formatForExcel),
      
      // Progress Metrics
      [powerAppsColumnMapping.timeProgress]: this.formatPercentage(project.timeProgress),
      [powerAppsColumnMapping.scheduleProgress]: this.formatPercentage(project.scheduleProgress),
      [powerAppsColumnMapping.scheduleVariance]: project.scheduleVariance,
      [powerAppsColumnMapping.performanceIndex]: project.performanceIndex,
      
      // Status Fields
      [powerAppsColumnMapping.executionStatus]: project.executionStatus,
      [powerAppsColumnMapping.scheduleStatus]: project.scheduleStatus,
      [powerAppsColumnMapping.overallStatus]: project.overallStatus,
      
      // Financial Data
      [powerAppsColumnMapping.contractValue]: this.formatCurrency(project.contractValue),
      [powerAppsColumnMapping.actualRevenue]: this.formatCurrency(project.actualRevenue),
      [powerAppsColumnMapping.plannedRevenue]: this.formatCurrency(project.plannedRevenue),
      [powerAppsColumnMapping.revenueVariance]: this.formatCurrency(project.revenueVariance),
      [powerAppsColumnMapping.costPerformanceIndex]: project.costPerformanceIndex,
      [powerAppsColumnMapping.budgetStatus]: project.budgetStatus,
      
      // Risk & Notes
      [powerAppsColumnMapping.riskLevel]: project.riskLevel,
      [powerAppsColumnMapping.recommendation]: project.recommendation,
      [powerAppsColumnMapping.workStatus]: project.workStatus
    }));

    return formattedData;
  }

  /**
   * Generate Power Apps Copilot prompts based on current data
   */
  static generateCopilotPrompts(): string[] {
    const projectManagers = [...new Set(mockProjectData.map(p => p.projectManager))];
    const regions = [...new Set(mockProjectData.map(p => p.region))];
    const companies = [...new Set(mockProjectData.map(p => p.companyName))];
    
    return [
      // Initial App Creation
      `Create a project management app for oil & gas construction projects in Egypt with ${mockProjectData.length} projects across ${regions.length} regions (${regions.join(', ')}) managed by ${projectManagers.length} project managers. Include dashboard with KPIs, hierarchical navigation (Portfolio → PM → Location → Client → Project → Details), and Petromaint branding (colors: red #DC2626, blue #004A80, yellow #FFC107).`,
      
      // Dashboard KPIs
      `Add KPI dashboard cards showing: Total Projects (${mockProjectData.length}), Active Projects (${mockProjectData.filter(p => p.executionStatus === 'In progress').length}), At-Risk Projects (${mockProjectData.filter(p => p.riskLevel === 'High Risk').length}), Total Contract Value (${this.formatCurrency(mockProjectData.reduce((sum, p) => sum + p.contractValue, 0))}), Average Completion Rate (${Math.round(mockProjectData.reduce((sum, p) => sum + p.scheduleProgress, 0) / mockProjectData.length * 100)}%).`,
      
      // Project Manager Gallery
      `Create project manager gallery showing: ${projectManagers.join(', ')}. Each card should display manager name, total projects, active projects, completion percentage with progress bar, and performance badge. Add click navigation to locations.`,
      
      // Location View
      `Add location view for Egyptian regions: ${regions.join(', ')}. Show project count per region, regional performance metrics, status indicators, and map placeholder. Include regional summary cards.`,
      
      // Client Portfolio
      `Create client portfolio view showing companies: ${companies.slice(0, 5).join(', ')}, and ${companies.length - 5} more companies. Display company cards with project counts, total contract values, relationship status, and recent activity indicators.`,
      
      // Project Data Table
      `Build comprehensive project table with columns: Project Name, Manager, Status, Progress Bar, Contract Value, Risk Level, Location. Add search, filters for status (In progress, Complete, Not started), risk level (Low Risk, Medium Risk, High Risk), and sorting capabilities.`,
      
      // Data Entry Form
      `Create new project entry form with fields: Project Code, Project Name, Project Manager (dropdown), Company (dropdown), Location (Egypt regions), Timeline (start/end dates), Contract Value (currency), Risk Assessment, Status tracking. Include validation and file upload.`
    ];
  }

  /**
   * Generate Power Apps formulas for common calculations
   */
  static generatePowerAppsFormulas(): Record<string, string> {
    return {
      // Dashboard KPIs
      totalProjects: "CountRows(Projects)",
      activeProjects: "CountIf(Projects, 'Execution Status' = \"In progress\")",
      atRiskProjects: "CountIf(Projects, 'Risk Level' = \"High Risk\")",
      totalContractValue: "Sum(Projects, 'Contract Value (EGP)')",
      averageCompletion: "Round(Average(Projects, 'Schedule Progress (%)') * 100, 1)",
      
      // Project Manager Grouping
      managerGrouping: `GroupBy(Projects, "Project Manager", "ManagerProjects")`,
      managerMetrics: `AddColumns(
        GroupBy(Projects, "Project Manager", "ManagerProjects"),
        "TotalProjects", CountRows(ManagerProjects),
        "ActiveProjects", CountIf(ManagerProjects, 'Execution Status' = "In progress"),
        "CompletionRate", Average(ManagerProjects, 'Schedule Progress (%)')
      )`,
      
      // Search and Filter
      searchProjects: `Search(Projects, SearchInput.Text, "Project Name", "Company Name", "Project Manager")`,
      filterByStatus: `Filter(Projects, If(StatusDropdown.Selected.Value = "All", true, 'Execution Status' = StatusDropdown.Selected.Value))`,
      filterByRisk: `Filter(Projects, If(RiskDropdown.Selected.Value = "All", true, 'Risk Level' = RiskDropdown.Selected.Value))`,
      
      // Progress Calculations
      progressBarValue: `ThisItem.'Schedule Progress (%)' * 100`,
      progressColor: `If(ThisItem.'Schedule Progress (%)' >= 0.8, Green, If(ThisItem.'Schedule Progress (%)' >= 0.6, Orange, Red))`,
      
      // Status Badge Colors
      statusColor: `Switch(ThisItem.'Overall Status', "HEALTHY", Green, "AT RISK", Orange, "PROGRESS HALTED", Red, Gray)`,
      riskColor: `Switch(ThisItem.'Risk Level', "Low Risk", Green, "Medium Risk", Orange, "High Risk", Red, Gray)`,
      
      // Financial Calculations
      revenueVariance: `ThisItem.'Actual Revenue (EGP)' - ThisItem.'Planned Revenue (EGP)'`,
      budgetUtilization: `ThisItem.'Actual Revenue (EGP)' / ThisItem.'Contract Value (EGP)'`,
      
      // Date Calculations
      daysPastDue: `DateDiff(ThisItem.'Planned End Date', Today(), Days)`,
      projectDuration: `DateDiff(ThisItem.'Actual Start Date', ThisItem.'Planned End Date', Days)`
    };
  }

  // Helper methods
  private static formatDate(date: Date, forExcel: boolean = true): string {
    if (forExcel) {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format for Excel
    }
    return date.toLocaleDateString();
  }

  private static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(value);
  }
}

// Export ready-to-use data and prompts
export const powerAppsExportData = PowerAppsExportService.formatForPowerApps(mockProjectData);
export const copilotPrompts = PowerAppsExportService.generateCopilotPrompts();
export const powerAppsFormulas = PowerAppsExportService.generatePowerAppsFormulas();

// Console output for easy copying
console.log('=== POWER APPS MIGRATION DATA ===');
console.log('1. Export Data:', powerAppsExportData);
console.log('2. Copilot Prompts:', copilotPrompts);
console.log('3. Power Apps Formulas:', powerAppsFormulas);