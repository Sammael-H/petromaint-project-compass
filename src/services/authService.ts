
// Main exports for authentication service
export * from '../types/auth';
export { AuthService } from './auth/authService';
export { AuthStorage } from './auth/authStorage';
export { authConfig } from './auth/authConfig';
export { useAuth } from '../hooks/useAuth';

// Create and export the service instance
import { AuthService } from './auth/authService';
import { authConfig } from './auth/authConfig';

export const authService = new AuthService(authConfig);
export default AuthService;
