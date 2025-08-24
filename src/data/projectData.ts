// Project data structure for Power Apps migration
// This matches the Excel format from your custom instructions

export interface ProjectExportData {
  // Project Identification
  projectManager: string;
  projectCode: string;
  projectName: string;
  projectType: 'Standalone Projects' | 'Parent projects' | 'Sub projects';
  projectSize: 'Small' | 'Medium' | 'Large' | 'Mega';
  
  // Location & Company
  country: string;
  region: string;
  city: string;
  technicalManager: string;
  companyCode: string;
  companyName: string;
  
  // Project Details
  sector: 'Oil' | 'Gas' | 'Chemical';
  businessType: 'Upstream' | 'Midstream / Storage' | 'Midstream / Transmission' | 'Downstream' | 'Production';
  facilityType: string;
  projectClass: 'Brownfield' | 'Greenfield';
  location: 'Onshore' | 'Offshore';
  
  // Timeline
  duration: number;
  currentDate: Date;
  actualStartDate: Date;
  plannedStartDate: Date;
  actualEndDate: Date;
  plannedEndDate: Date;
  
  // Progress Metrics
  timeProgress: number;
  scheduleProgress: number;
  scheduleVariance: number;
  performanceIndex: number;
  
  // Status
  executionStatus: 'Complete' | 'In progress' | 'Not started';
  scheduleStatus: 'On time' | 'Behind' | 'Overdue';
  overallStatus: 'HEALTHY' | 'AT RISK' | 'PROGRESS HALTED';
  
  // Financial
  contractValue: number;
  actualRevenue: number;
  plannedRevenue: number;
  revenueVariance: number;
  costPerformanceIndex: number;
  budgetStatus: 'ON' | 'OVER';
  
  // Risk Assessment
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
  
  // Comments
  recommendation: string;
  workStatus: string;
}

// Mock data based on your Excel file
export const mockProjectData: ProjectExportData[] = [
  {
    projectManager: "Eng. Mohamed Mousa",
    projectCode: "10273663001",
    projectName: "Firefighting Works Contract No. (10/2022)",
    projectType: "Standalone Projects",
    projectSize: "Large",
    country: "Egypt",
    region: "Nile Delta",
    city: "Port Said",
    technicalManager: "Eng. Islam Karaweih",
    companyCode: "1027",
    companyName: "BURULLUS GAS CO.",
    sector: "Gas",
    businessType: "Midstream / Storage",
    facilityType: "Gas Tank",
    projectClass: "Brownfield",
    location: "Onshore",
    duration: 779,
    currentDate: new Date("2025-01-24"),
    actualStartDate: new Date("2022-11-13"),
    plannedStartDate: new Date("2024-01-03"),
    actualEndDate: new Date("2022-11-13"),
    plannedEndDate: new Date("2024-12-31"),
    timeProgress: 0.18,
    scheduleProgress: 0.98,
    scheduleVariance: -0.8,
    performanceIndex: 0.1837,
    executionStatus: "In progress",
    scheduleStatus: "Overdue",
    overallStatus: "PROGRESS HALTED",
    contractValue: 96408000,
    actualRevenue: 11548206,
    plannedRevenue: 17353440,
    revenueVariance: -5805234,
    costPerformanceIndex: 0.665,
    budgetStatus: "OVER",
    riskLevel: "High Risk",
    recommendation: "Project is both behind schedule and nearing its end date. Increase resources, expedite critical tasks, negotiate deadline extension, perform risk reassessment.",
    workStatus: "Only the first phase has been received, and its paints have been supplied. It will be completed by 31/12/2024 to deliver the project to the client and to suffice with what has been executed according to the agreement with the client."
  },
  {
    projectManager: "Eng. Mohamed Mousa",
    projectCode: "10274103001",
    projectName: "Works for Changing Control Devices of Central Air Conditioning Systems at the Fields of Burullus Company (2024/010)",
    projectType: "Standalone Projects",
    projectSize: "Small",
    country: "Egypt",
    region: "Nile Delta",
    city: "Port Said",
    technicalManager: "Eng. Islam Karaweih",
    companyCode: "1027",
    companyName: "BURULLUS GAS CO.",
    sector: "Gas",
    businessType: "Downstream",
    facilityType: "Gas Processing Plant",
    projectClass: "Brownfield",
    location: "Onshore",
    duration: 365,
    currentDate: new Date("2025-01-24"),
    actualStartDate: new Date("2024-09-30"),
    plannedStartDate: new Date("2024-03-09"),
    actualEndDate: new Date("2024-09-30"),
    plannedEndDate: new Date("2025-09-30"),
    timeProgress: 0,
    scheduleProgress: 0,
    scheduleVariance: 0,
    performanceIndex: 0,
    executionStatus: "Not started",
    scheduleStatus: "On time",
    overallStatus: "HEALTHY",
    contractValue: 6300000,
    actualRevenue: 0,
    plannedRevenue: 0,
    revenueVariance: 0,
    costPerformanceIndex: 0,
    budgetStatus: "ON",
    riskLevel: "Low Risk",
    recommendation: "Project is on track or not started yet. Continue regular monitoring, ensure resources are allocated efficiently.",
    workStatus: "Duration of the operation: One Gregorian year. The works have been assigned to the contractor 'Aircom'. We are awaiting the receipt of the unprepared site from the client, and it has been informed by the General Projects Manager that the site is expected to be received next week."
  },
  // Add more projects as needed...
];

// Excel export helper functions
export const exportToExcel = (data: ProjectExportData[]) => {
  // This would generate Excel file for Power Apps import
  console.log('Exporting data for Power Apps migration:', data);
  return data;
};

// Power Apps column mapping
export const powerAppsColumnMapping = {
  // Maps React data structure to Power Apps expected columns
  projectManager: "Project Manager",
  projectCode: "Project Code",
  projectName: "Project Name",
  projectType: "Project Type",
  projectSize: "Project Size",
  country: "Country",
  region: "Region",
  city: "City",
  technicalManager: "Technical Manager",
  companyCode: "Company Code",
  companyName: "Company Name",
  sector: "Sector",
  businessType: "Business Type",
  facilityType: "Facility Type",
  projectClass: "Project Class",
  location: "Location",
  duration: "Duration (Days)",
  currentDate: "Current Date",
  actualStartDate: "Actual Start Date",
  plannedStartDate: "Planned Start Date",
  actualEndDate: "Actual End Date",
  plannedEndDate: "Planned End Date",
  timeProgress: "Time Progress (%)",
  scheduleProgress: "Schedule Progress (%)",
  scheduleVariance: "Schedule Variance",
  performanceIndex: "Performance Index",
  executionStatus: "Execution Status",
  scheduleStatus: "Schedule Status",
  overallStatus: "Overall Status",
  contractValue: "Contract Value (EGP)",
  actualRevenue: "Actual Revenue (EGP)",
  plannedRevenue: "Planned Revenue (EGP)",
  revenueVariance: "Revenue Variance (EGP)",
  costPerformanceIndex: "Cost Performance Index",
  budgetStatus: "Budget Status",
  riskLevel: "Risk Level",
  recommendation: "Recommendation",
  workStatus: "Work Status"
};