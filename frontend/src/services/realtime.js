import api from './api.js';

class RealtimeService {
  constructor() {
    this.listeners = new Map();
    this.eventSource = null;
    this.pollTimer = null;
    this.lastTimestamp = Math.floor(Date.now() / 1000);
    this.isConnected = false;
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    this.connectStream();
  }

  connectStream() {
    try {
      if (typeof EventSource !== 'undefined') {
        const streamUrl = '/api/realtime/stream';
        this.eventSource = new EventSource(streamUrl);

        this.eventSource.onopen = () => {
          this.isConnected = true;
          this.emit('connected', { status: 'online' });
        };

        this.eventSource.addEventListener('snapshot', (e) => {
          try {
            const data = JSON.parse(e.data);
            this.emit('snapshot', data);
          } catch (err) {}
        });

        this.eventSource.addEventListener('store_updated', (e) => {
          api.clearCache?.();
          this.emit('store_updated', { time: Date.now() });
        });

        this.eventSource.onerror = () => {
          this.isConnected = false;
          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }
          this.startSyncPolling();
        };
      } else {
        this.startSyncPolling();
      }
    } catch (err) {
      this.startSyncPolling();
    }
  }

  startSyncPolling() {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(async () => {
      try {
        const res = await api.get(`/realtime/sync?since=${this.lastTimestamp}`);
        if (res.data?.success) {
          this.lastTimestamp = res.data.timestamp;
          if (res.data.hasUpdate) {
            api.clearCache?.();
            this.emit('store_updated', res.data);
          }
        }
      } catch (e) {}
    }, 12000);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error('Realtime handler error:', err);
        }
      });
    }
  }
}

export const realtime = new RealtimeService();
export default realtime;
