
import { AuthConfig } from '../../types/auth';

export const authConfig: AuthConfig = {
  clientId: 'YOUR_CLIENT_ID', // Replace with actual client ID
  tenantId: 'YOUR_TENANT_ID', // Replace with actual tenant ID
  redirectUri: window.location.origin + '/auth/callback',
  scopes: [
    'https://org.crm.dynamics.com/.default', // Dataverse access
    'https://analysis.windows.net/powerbi/api/.default', // Power BI access
    'openid',
    'profile',
    'email'
  ]
};
