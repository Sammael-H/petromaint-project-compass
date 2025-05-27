
import React from 'react';
import { AuthUser, LoginResult } from '../types/auth';
import { authService } from '../services/authService';

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
