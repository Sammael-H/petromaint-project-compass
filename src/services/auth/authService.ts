
import { AuthConfig, AuthUser, LoginResult } from '../../types/auth';
import { AuthStorage } from './authStorage';

export class AuthService {
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
      AuthStorage.clearCache();
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

  // Role-based access control
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
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
    AuthStorage.saveUser(user);
  }

  private loadUserFromStorage(): AuthUser | null {
    return AuthStorage.loadUser();
  }

  private clearStorage(): void {
    AuthStorage.clearUser();
  }
}
