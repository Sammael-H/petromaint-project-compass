
import React from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

interface ConflictResolution {
  strategy: 'local' | 'remote' | 'merge';
  mergeFunction?: (local: any, remote: any) => any;
}

export class OfflineService {
  private cache = new Map<string, CacheItem<any>>();
  private syncQueue: SyncQueueItem[] = [];
  private isOnline = navigator.onLine;
  private maxRetries = 3;
  private syncInProgress = false;

  constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
  }

  private initializeEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadFromStorage(): void {
    try {
      const cachedData = localStorage.getItem('petromaint_cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        this.cache = new Map(parsed.cache || []);
        this.syncQueue = parsed.syncQueue || [];
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        syncQueue: this.syncQueue
      };
      localStorage.setItem('petromaint_cache', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  // Cache management
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : undefined
    };
    this.cache.set(key, item);
    this.saveToStorage();
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    if (!item) return null;

    // Check expiration
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check expiration
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.saveToStorage();
  }

  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  // Data operations with offline support
  async getData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    forceRefresh = false
  ): Promise<T> {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && this.has(key)) {
      const cached = this.get<T>(key);
      if (cached !== null) {
        return cached;
      }
    }

    // If offline, return cached data or throw error
    if (!this.isOnline) {
      const cached = this.get<T>(key);
      if (cached !== null) {
        return cached;
      }
      throw new Error('No cached data available and device is offline');
    }

    try {
      const data = await fetchFn();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      // Fallback to cached data on error
      const cached = this.get<T>(key);
      if (cached !== null) {
        console.warn('Using cached data due to network error:', error);
        return cached;
      }
      throw error;
    }
  }

  // Optimistic updates with sync queue
  async updateData<T extends Record<string, any>>(
    key: string,
    data: Partial<T>,
    entity: string,
    id: string,
    operation: 'create' | 'update' | 'delete' = 'update'
  ): Promise<void> {
    // Apply optimistic update to cache
    if (operation === 'delete') {
      this.delete(key);
    } else {
      const existing = this.get<T>(key);
      const updated = existing ? { ...existing, ...data } : data as T;
      this.set(key, updated);
    }

    // Add to sync queue
    const queueItem: SyncQueueItem = {
      id: `${entity}_${id}_${Date.now()}`,
      operation,
      entity,
      data: operation === 'delete' ? { id } : data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.syncQueue.push(queueItem);
    this.saveToStorage();

    // Process queue if online
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  // Sync queue processing
  private async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || this.syncQueue.length === 0) return;

    this.syncInProgress = true;

    try {
      const itemsToProcess = [...this.syncQueue];
      
      for (const item of itemsToProcess) {
        try {
          await this.processSyncItem(item);
          // Remove successful items from queue
          this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
        } catch (error) {
          console.error('Sync item failed:', item, error);
          
          // Increment retry count
          const queueItem = this.syncQueue.find(q => q.id === item.id);
          if (queueItem) {
            queueItem.retryCount++;
            
            // Remove items that exceeded max retries
            if (queueItem.retryCount >= this.maxRetries) {
              this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
              console.error('Max retries exceeded for sync item:', item);
            }
          }
        }
      }

      this.saveToStorage();
    } finally {
      this.syncInProgress = false;
    }
  }

  private async processSyncItem(item: SyncQueueItem): Promise<void> {
    // This would integrate with your actual API service
    // For now, simulate API calls
    console.log('Processing sync item:', item);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In real implementation, this would call the appropriate API endpoints
    switch (item.operation) {
      case 'create':
        // await apiService.create(item.entity, item.data);
        break;
      case 'update':
        // await apiService.update(item.entity, item.data);
        break;
      case 'delete':
        // await apiService.delete(item.entity, item.data.id);
        break;
    }
  }

  // Conflict resolution
  async resolveConflict<T>(
    key: string,
    localData: T,
    remoteData: T,
    resolution: ConflictResolution
  ): Promise<T> {
    switch (resolution.strategy) {
      case 'local':
        return localData;
      case 'remote':
        this.set(key, remoteData);
        return remoteData;
      case 'merge':
        if (resolution.mergeFunction) {
          const merged = resolution.mergeFunction(localData, remoteData);
          this.set(key, merged);
          return merged;
        }
        // Default merge strategy
        const merged = { ...remoteData, ...localData };
        this.set(key, merged);
        return merged;
      default:
        return remoteData;
    }
  }

  // Statistics and monitoring
  getCacheStats() {
    const totalItems = this.cache.size;
    const queuedItems = this.syncQueue.length;
    const expiredItems = Array.from(this.cache.values()).filter(
      item => item.expiresAt && Date.now() > item.expiresAt
    ).length;

    return {
      totalItems,
      queuedItems,
      expiredItems,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }
}

// Hook for React components
export const useOfflineService = () => {
  const [service] = React.useState(() => new OfflineService());
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [stats, setStats] = React.useState(service.getCacheStats());

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update stats periodically
    const interval = setInterval(() => {
      setStats(service.getCacheStats());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [service]);

  return {
    service,
    isOnline,
    stats
  };
};

// Create and export singleton instance
export const offlineService = new OfflineService();
export default OfflineService;
