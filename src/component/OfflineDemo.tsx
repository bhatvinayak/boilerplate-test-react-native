import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import OfflineService from '../services/OfflineService';

interface Item {
  id: string;
  text: string;
  isPending?: boolean;
}

const OfflineDemo = () => {
  const { isConnected, checkConnection } = useNetworkStatus();
  const [items, setItems] = useState<Item[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Load cache on mount
  useEffect(() => {
    const loadInitialData = async () => {
      const cachedItems = await OfflineService.getCache();
      const pendingQueue = await OfflineService.getQueue();

      // Combine cached items with pending ones for Optimistic UI
      const pendingItems: Item[] = pendingQueue.map(task => ({
        id: task.id,
        text: task.payload.text,
        isPending: true,
      }));

      setItems([...cachedItems, ...pendingItems]);
    };

    loadInitialData();
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (isConnected && !isSyncing) {
      handleSync();
    }
  }, [isConnected]);

  const handleSync = async () => {
    const queue = await OfflineService.getQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    await OfflineService.syncPendingActions(payload => {
      // This would normally be where you refresh data from server
      // For this demo, we just mark them as synced in local state
      setItems(prev =>
        prev.map(item =>
          item.text === payload.text ? { ...item, isPending: false } : item,
        ),
      );
    });

    // Save final state to cache
    const currentItems = await OfflineService.getCache();
    // In a real app, you'd fetch from server here.
    setIsSyncing(false);
  };

  const onRetryConnection = async () => {
    setIsChecking(true);
    await checkConnection();
    // Small delay to show feedback
    setTimeout(() => setIsChecking(false), 500);
  };

  const addItem = async () => {
    if (!inputText.trim()) return;

    const newItem: Item = {
      id: Math.random().toString(),
      text: inputText,
      isPending: !isConnected,
    };

    // Update UI immediately (Optimistic Update)
    setItems(prev => [...prev, newItem]);
    setInputText('');

    if (isConnected) {
      // Simulate API call
      console.log('Online: Sending to server...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const currentCache = await OfflineService.getCache();
      await OfflineService.saveToCache([...currentCache, newItem]);
    } else {
      // Offline: Add to pending queue
      console.log('Offline: Adding to pending queue...');
      await OfflineService.addToQueue({
        type: 'ADD_ITEM',
        payload: { text: inputText },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Network Status Banner */}
      <View
        style={[
          styles.banner,
          { backgroundColor: isConnected ? '#4CAF50' : '#F44336' },
        ]}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>
            {isConnected
              ? 'Online - Changes sync automatically'
              : 'Offline - Changes will queue'}
          </Text>
          {!isConnected && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRetryConnection}
              disabled={isChecking}
            >
              {isChecking ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.retryText}>Retry</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Offline-First Demo</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add something..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {isSyncing && (
          <View style={styles.syncingIndicator}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.syncingText}>Syncing pending actions...</Text>
          </View>
        )}

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.text}</Text>
              {item.isPending && (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>Pending ⏳</Text>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No items yet. Try adding one!</Text>
          }
        />
      </View>
    </View>
  );
};

export default OfflineDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    padding: 10,
    alignItems: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  retryButton: {
    marginLeft: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  pendingBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#E65100',
  },
  syncingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#E3F2FD',
    padding: 10,
    borderRadius: 8,
  },
  syncingText: {
    marginLeft: 10,
    color: '#1976D2',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
});
