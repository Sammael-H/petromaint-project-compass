
export interface AuthConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
  scopes: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface LoginResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}
