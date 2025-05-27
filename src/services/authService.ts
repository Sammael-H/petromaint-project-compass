import React from 'react';

// Azure AD Authentication Service for Petromaint App
// Handles authentication with Azure Active Directory

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

class AuthService {
  private config: AuthConfig;
  private currentUser: AuthUser | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
    this.loadUserFromStorage();
  }

  // Initialize authentication with Azure AD
  async initialize(): Promise<void> {
    try {
      // Check if user is already logged in
      const storedUser = this.loadUserFromStorage();
      if (storedUser && this.isTokenValid(storedUser)) {
        this.currentUser = storedUser;
      }
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      this.clearStorage();
    }
  }

  // Login with Azure AD
  async login(): Promise<LoginResult> {
    try {
      // In a real implementation, this would use MSAL.js or similar
      // For now, we'll simulate the login flow
      const authUrl = this.buildAuthUrl();
      
      // This would normally open a browser window or redirect
      console.log('Auth URL:', authUrl);
      
      // Simulate successful authentication
      const mockUser: AuthUser = {
        id: 'user-123',
        name: 'Ahmed Hassan',
        email: 'ahmed.hassan@petromaint.com',
        role: 'ProjectManager',
        accessToken: 'mock-access-token-' + Date.now(),
        expiresAt: Date.now() + (3600 * 1000) // 1 hour
      };

      this.currentUser = mockUser;
      this.saveUserToStorage(mockUser);

      return {
        success: true,
        user: mockUser
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // In a real implementation, this would call Azure AD logout endpoint
      this.currentUser = null;
      this.clearStorage();
      
      // Clear any cached data
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('petromaint_cache');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      if (!this.currentUser?.refreshToken) {
        return false;
      }

      // In a real implementation, this would call Azure AD token refresh endpoint
      const refreshUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`;
      
      // Mock refresh - in reality you'd make an actual API call
      const refreshedUser: AuthUser = {
        ...this.currentUser,
        accessToken: 'refreshed-token-' + Date.now(),
        expiresAt: Date.now() + (3600 * 1000)
      };

      this.currentUser = refreshedUser;
      this.saveUserToStorage(refreshedUser);

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  // Get current user
  getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.isTokenValid(this.currentUser);
  }

  // Get access token
  async getAccessToken(): Promise<string | null> {
    if (!this.currentUser) {
      return null;
    }

    if (this.isTokenValid(this.currentUser)) {
      return this.currentUser.accessToken;
    }

    // Try to refresh token
    const refreshed = await this.refreshToken();
    return refreshed ? this.currentUser?.accessToken || null : null;
  }

  // Private methods
  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      response_mode: 'query',
      state: 'petromaint-' + Date.now()
    });

    return `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  private isTokenValid(user: AuthUser): boolean {
    return Date.now() < user.expiresAt;
  }

  private saveUserToStorage(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('petromaint_user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to save user to storage:', error);
      }
    }
  }

  private loadUserFromStorage(): AuthUser | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('petromaint_user');
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        return null;
      }
    }
    return null;
  }

  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('petromaint_user');
      } catch (error) {
        console.error('Failed to clear storage:', error);
      }
    }
  }

  // Role-based access control
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }
}

// Configuration for Petromaint
const authConfig: AuthConfig = {
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

// Service instance
export const authService = new AuthService(authConfig);

// React hook for authentication
export const useAuth = () => {
  const [user, setUser] = React.useState<AuthUser | null>(authService.getCurrentUser());
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    authService.initialize();
    setUser(authService.getCurrentUser());
  }, []);

  const login = async (): Promise<LoginResult> => {
    setLoading(true);
    try {
      const result = await authService.login();
      if (result.success) {
        setUser(result.user || null);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    login,
    logout,
    getAccessToken: authService.getAccessToken.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    hasAnyRole: authService.hasAnyRole.bind(authService)
  };
};

export default AuthService;
