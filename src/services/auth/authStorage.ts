
import { AuthUser } from '../../types/auth';

export class AuthStorage {
  private static readonly USER_KEY = 'petromaint_user';
  private static readonly CACHE_KEY = 'petromaint_cache';

  static saveUser(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      } catch (error) {
        console.error('Failed to save user to storage:', error);
      }
    }
  }

  static loadUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(this.USER_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.error('Failed to load user from storage:', error);
        return null;
      }
    }
    return null;
  }

  static clearUser(): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(this.USER_KEY);
      } catch (error) {
        console.error('Failed to clear user storage:', error);
      }
    }
  }

  static clearCache(): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(this.CACHE_KEY);
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }
  }
}
