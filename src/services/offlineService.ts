// Offline Storage and Synchronization Service
// Handles local caching and conflict resolution

import React from 'react';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  version: number;
  dirty: boolean; // Has local changes not synced
}

export interface SyncConflict<T> {
  id: string;
  localData: T;
  remoteData: T;
  localTimestamp: number;
  remoteTimestamp: number;
}

export interface SyncResult<T> {
  success: boolean;
  conflicts: SyncConflict<T>[];
  synced: number;
  failed: string[];
}

class OfflineService {
  private storageKey = 'petromaint_offline_';
  private syncQueue: string[] = [];

  // Generic cache operations
  async setItem<T>(key: string, data: T, version: number = 1): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      version,
      dirty: false
    };

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          this.storageKey + key,
          JSON.stringify(cacheItem)
        );
      } catch (error) {
        console.error('Failed to cache item:', error);
        // Handle storage quota exceeded
        this.cleanupOldEntries();
      }
    }
  }

  async getItem<T>(key: string): Promise<CacheItem<T> | null> {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(this.storageKey + key);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.error('Failed to retrieve cached item:', error);
        return null;
      }
    }
    return null;
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.storageKey + key);
    }
  }

  // Mark item as dirty (has local changes)
  async markDirty<T>(key: string): Promise<void> {
    const item = await this.getItem<T>(key);
    if (item) {
      item.dirty = true;
      await this.setItem(key, item.data, item.version);
      this.addToSyncQueue(key);
    }
  }

  // Project-specific cache operations
  async cacheProjects(projects: any[]): Promise<void> {
    for (const project of projects) {
      await this.setItem(`project_${project.projectid}`, project);
    }
    await this.setItem('projects_list', projects.map(p => p.projectid));
    await this.setItem('projects_last_sync', Date.now());
  }

  async getCachedProjects(): Promise<any[]> {
    const projectIds = await this.getItem<string[]>('projects_list');
    if (!projectIds?.data) return [];

    const projects = [];
    for (const id of projectIds.data) {
      const project = await this.getItem(`project_${id}`);
      if (project) {
        projects.push(project.data);
      }
    }
    return projects;
  }

  // Task-specific cache operations
  async cacheTasks(tasks: any[]): Promise<void> {
    for (const task of tasks) {
      await this.setItem(`task_${task.taskid}`, task);
    }
  }

  async getCachedTasks(projectId: string): Promise<any[]> {
    const allTasks = await this.getAllCachedItems<any>('task_');
    return allTasks.filter(task => task.projectid === projectId);
  }

  // Update task locally
  async updateTaskLocally(taskId: string, updates: any): Promise<void> {
    const task = await this.getItem(`task_${taskId}`);
    if (task) {
      const updatedTask = { ...task.data, ...updates };
      await this.setItem(`task_${taskId}`, updatedTask, task.version + 1);
      await this.markDirty(`task_${taskId}`);
    }
  }

  // Synchronization
  async syncWithRemote<T>(
    localKey: string,
    remoteData: T,
    remoteTimestamp: number
  ): Promise<'local' | 'remote' | 'conflict'> {
    const localItem = await this.getItem<T>(localKey);
    
    if (!localItem) {
      // No local data, use remote
      await this.setItem(localKey, remoteData);
      return 'remote';
    }

    if (!localItem.dirty) {
      // No local changes, use remote
      await this.setItem(localKey, remoteData);
      return 'remote';
    }

    if (localItem.timestamp > remoteTimestamp) {
      // Local is newer, keep local
      return 'local';
    }

    // Conflict - both have changes
    return 'conflict';
  }

  // Resolve conflicts based on strategy
  async resolveConflict<T>(
    key: string,
    conflict: SyncConflict<T>,
    strategy: 'local' | 'remote' | 'merge'
  ): Promise<void> {
    switch (strategy) {
      case 'local':
        // Keep local version
        break;
      case 'remote':
        await this.setItem(key, conflict.remoteData);
        break;
      case 'merge':
        // Simple merge strategy - you might want more sophisticated logic
        const merged = Object.assign({}, conflict.remoteData, conflict.localData);
        await this.setItem(key, merged);
        break;
    }
  }

  // Sync queue management
  private addToSyncQueue(key: string): void {
    if (!this.syncQueue.includes(key)) {
      this.syncQueue.push(key);
    }
  }

  getSyncQueue(): string[] {
    return [...this.syncQueue];
  }

  clearSyncQueue(): void {
    this.syncQueue = [];
  }

  // Network status
  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // Utility methods
  private async getAllCachedItems<T>(prefix: string): Promise<T[]> {
    if (typeof window === 'undefined') return [];

    const items: T[] = [];
    const storage = window.localStorage;

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(this.storageKey + prefix)) {
        try {
          const item = JSON.parse(storage.getItem(key) || '');
          items.push(item.data);
        } catch (error) {
          console.error('Failed to parse cached item:', error);
        }
      }
    }

    return items;
  }

  private cleanupOldEntries(): void {
    if (typeof window === 'undefined') return;

    const storage = window.localStorage;
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    const keysToRemove: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(this.storageKey)) {
        try {
          const item = JSON.parse(storage.getItem(key) || '');
          if (now - item.timestamp > maxAge) {
            keysToRemove.push(key);
          }
        } catch (error) {
          // Invalid item, remove it
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key));
  }

  // Get cache statistics
  getCacheStats(): {
    totalItems: number;
    dirtyItems: number;
    cacheSize: number;
    lastSync: number | null;
  } {
    if (typeof window === 'undefined') {
      return { totalItems: 0, dirtyItems: 0, cacheSize: 0, lastSync: null };
    }

    const storage = window.localStorage;
    let totalItems = 0;
    let dirtyItems = 0;
    let cacheSize = 0;

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(this.storageKey)) {
        const value = storage.getItem(key) || '';
        cacheSize += value.length;
        totalItems++;

        try {
          const item = JSON.parse(value);
          if (item.dirty) dirtyItems++;
        } catch (error) {
          // Ignore parse errors
        }
      }
    }

    const lastSyncItem = await this.getItem<number>('projects_last_sync');
    const lastSync = lastSyncItem?.data || null;

    return {
      totalItems,
      dirtyItems,
      cacheSize,
      lastSync
    };
  }

  // Clear all cache
  async clearAll(): Promise<void> {
    if (typeof window === 'undefined') return;

    const storage = window.localStorage;
    const keysToRemove: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(this.storageKey)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => storage.removeItem(key));
    this.clearSyncQueue();
  }
}

// Service instance
export const offlineService = new OfflineService();

// React hook for offline data
export const useOfflineData = <T>(key: string) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isDirty, setIsDirty] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cached = await offlineService.getItem<T>(key);
        if (cached) {
          setData(cached.data);
          setIsDirty(cached.dirty);
        }
      } catch (error) {
        console.error('Failed to load offline data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  const updateData = async (newData: T) => {
    await offlineService.setItem(key, newData);
    setData(newData);
    setIsDirty(false);
  };

  const markDirty = async () => {
    await offlineService.markDirty(key);
    setIsDirty(true);
  };

  return {
    data,
    loading,
    isDirty,
    updateData,
    markDirty
  };
};

export default OfflineService;
