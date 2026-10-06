import { useSyncExternalStore } from 'react';
import { fetchServerStatus, STATUS_REFRESH_INTERVAL } from '../lib/serverStatus';

let snapshot = { serverData: null, responseTime: null, loading: true, error: null };
const listeners = new Set();
let interval = null;
let pending = null;

function publish(next) {
  snapshot = next;
  listeners.forEach(listener => listener());
}

function refresh() {
  if (pending) return;

  pending = fetchServerStatus()
    .then(result => publish({ ...result, loading: false, error: null }))
    .catch(error => publish({ ...snapshot, loading: false, error: error.message }))
    .finally(() => { pending = null; });
}

function subscribe(listener) {
  listeners.add(listener);
  if (listeners.size === 1) {
    refresh();
    interval = setInterval(refresh, STATUS_REFRESH_INTERVAL);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(interval);
      interval = null;
    }
  };
}

const getSnapshot = () => snapshot;

export function useServerStatus() {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  const online = state.serverData?.online;
  const statusLabel = state.loading ? 'Checking...' : online === undefined
    ? 'Status unavailable'
    : `${state.error ? 'Last known: ' : ''}${online ? 'Online' : 'Offline'}`;

  return { ...state, online, statusLabel };
}
