import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@app_data_cache';
const QUEUE_KEY = '@pending_actions_queue';

export interface ActionTask {
  id: string;
  type: 'ADD_ITEM';
  payload: any;
  timestamp: number;
}

class OfflineService {
  /**
   * Saves data to the local cache
   */
  async saveToCache(data: any[]) {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  /**
   * Loads data from the local cache
   */
  async getCache(): Promise<any[]> {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error loading cache:', error);
      return [];
    }
  }

  /**
   * Adds an action to the pending queue
   */
  async addToQueue(action: Omit<ActionTask, 'id' | 'timestamp'>) {
    try {
      const queue = await this.getQueue();
      const newTask: ActionTask = {
        ...action,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      queue.push(newTask);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      return newTask;
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  }

  /**
   * Gets all pending actions
   */
  async getQueue(): Promise<ActionTask[]> {
    try {
      const queue = await AsyncStorage.getItem(QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error loading queue:', error);
      return [];
    }
  }

  /**
   * Clears the pending queue
   */
  async clearQueue() {
    await AsyncStorage.removeItem(QUEUE_KEY);
  }

  /**
   * Processes the pending queue (Simulated)
   */
  async syncPendingActions(onSuccess: (item: any) => void) {
    const queue = await this.getQueue();
    if (queue.length === 0) return;

    console.log(`Syncing ${queue.length} pending actions...`);

    for (const task of queue) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (task.type === 'ADD_ITEM') {
        onSuccess(task.payload);
      }
    }

    await this.clearQueue();
    console.log('Sync complete.');
  }
}

export default new OfflineService();
