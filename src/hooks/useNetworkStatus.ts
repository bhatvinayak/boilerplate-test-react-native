import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

// High-availability endpoint for connectivity "truth"
const PING_URL = 'https://www.google.com';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const pollTimer = useRef<any>(null);
  const backoffSeconds = useRef(2);
  const isOnlineRef = useRef<boolean | null>(null);
  const appState = useRef(AppState.currentState);

  // Sync ref with state for use in async callbacks
  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  const verifyInternetAccess = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(PING_URL, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(id);
      return response.status >= 200 || response.type === 'opaque';
    } catch (e) {
      return false;
    }
  };

  const resetPolling = useCallback(() => {
    backoffSeconds.current = 2;
    if (pollTimer.current) {
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  const updateState = useCallback(async (state: NetInfoState) => {
    let online = !!(state.isInternetReachable ?? state.isConnected);
    
    if (!online || state.isInternetReachable === false) {
      console.log('[Network] NetInfo says offline/unsure. Verifying with ping...');
      const hasRealAccess = await verifyInternetAccess();
      if (hasRealAccess) {
        console.log('[Network] Ping succeeded! Overriding NetInfo state to Online.');
        online = true;
      }
    }

    console.log(`[Network] Result: ${online ? 'ONLINE' : 'OFFLINE'} (connected=${state.isConnected}, reachable=${state.isInternetReachable})`);
    
    setIsOnline(online);

    if (online) {
      resetPolling();
    }
  }, [resetPolling]);

  const startPolling = useCallback(() => {
    if (pollTimer.current) return;

    const runPoll = async () => {
      // If we already became online through a listener, stop polling
      if (isOnlineRef.current) {
        resetPolling();
        return;
      }

      console.log(`[Network] Polling check (backoff: ${backoffSeconds.current}s)`);
      const state = await NetInfo.fetch();
      await updateState(state);

      // If we are still offline after the update, schedule next poll
      if (!isOnlineRef.current) {
         const nextInterval = backoffSeconds.current * 1000;
         pollTimer.current = setTimeout(runPoll, nextInterval);
         backoffSeconds.current = Math.min(backoffSeconds.current * 2, 32);
      }
    };

    pollTimer.current = setTimeout(runPoll, backoffSeconds.current * 1000);
  }, [updateState, resetPolling]);

  const checkConnection = useCallback(async () => {
    console.log('[Network] Connection Refresh Triggered (Manual/AppForeground)');
    const state = await NetInfo.refresh();
    await updateState(state);
    
    // If still offline after refresh, ensure polling is active
    if (!isOnlineRef.current) {
      startPolling();
    }
    
    return isOnlineRef.current;
  }, [updateState, startPolling]);

  useEffect(() => {
    // 1. Listen for NetInfo events
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      updateState(state).then(() => {
        if (isOnlineRef.current === false) startPolling();
      });
    });

    // 2. Listen for AppState changes (Foreground/Background)
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('[Network] App has come to the foreground. Refreshing...');
        checkConnection();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial check
    NetInfo.fetch().then((state) => {
      updateState(state).then(() => {
        if (isOnlineRef.current === false) startPolling();
      });
    });

    return () => {
      unsubscribeNetInfo();
      subscription.remove();
      if (pollTimer.current) {
        clearTimeout(pollTimer.current);
      }
    };
  }, [updateState, startPolling, checkConnection]);

  return { isConnected: isOnline ?? true, checkConnection };
};
